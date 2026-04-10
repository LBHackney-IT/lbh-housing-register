/**
 * After `next build` (output: 'standalone'):
 * 1) Install restana / serverless-http / serve-static into the traced bundle.
 * 2) Prune paths that inflate the zip but are not needed on AWS Lambda linux x64.
 *
 * Lambda hard limit: unzipped deployment package < 262144000 bytes (~250MB).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const standalone = path.join(repoRoot, 'build', '_next', 'standalone');

function rmRecursive(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function walkFiles(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, fn);
    else fn(full);
  }
}

function pruneSourceMaps(root) {
  walkFiles(root, (file) => {
    if (file.endsWith('.map')) {
      try {
        fs.unlinkSync(file);
      } catch {
        /* ignore */
      }
    }
  });
}

/** AWS Lambda Node.js on x86 uses glibc Linux; drop other @next/swc platform binaries (~100MB+). */
function pruneNextSwc(standaloneRoot) {
  const nextDir = path.join(standaloneRoot, 'node_modules', '@next');
  if (!fs.existsSync(nextDir)) return;
  const keep = /^swc-linux-x64-gnu$/;
  for (const name of fs.readdirSync(nextDir)) {
    if (name.startsWith('swc-') && !keep.test(name)) {
      rmRecursive(path.join(nextDir, name));
    }
  }
}

/** @esbuild ships per-OS; keep linux x64 only. */
function pruneEsbuildVariants(standaloneRoot) {
  const esbuildDir = path.join(standaloneRoot, 'node_modules', '@esbuild');
  if (!fs.existsSync(esbuildDir)) return;
  for (const name of fs.readdirSync(esbuildDir)) {
    if (!name.includes('linux-x64')) {
      rmRecursive(path.join(esbuildDir, name));
    }
  }
}

/** @img optional prebuilds — Lambda Node x86 uses linux x64 glibc; drop other OS/arch variants. */
function pruneSharpPrebuilds(standaloneRoot) {
  const imgDir = path.join(standaloneRoot, 'node_modules', '@img');
  if (!fs.existsSync(imgDir)) return;
  for (const name of fs.readdirSync(imgDir)) {
    if (/darwin|win32|linux-arm64|musl|freebsd/i.test(name)) {
      rmRecursive(path.join(imgDir, name));
    }
  }
}

/**
 * Remove test/docs/example trees at top level of each package (runtime never needs them).
 * Saves a lot across many deps.
 */
function prunePackageDevTrees(standaloneRoot) {
  const nm = path.join(standaloneRoot, 'node_modules');
  if (!fs.existsSync(nm)) return;
  const junkDirs = new Set([
    'test',
    'tests',
    '__tests__',
    'example',
    'examples',
    'docs',
    'doc',
    'coverage',
    '.github',
  ]);
  const pruneAt = (packageRoot) => {
    for (const j of junkDirs) {
      rmRecursive(path.join(packageRoot, j));
    }
  };
  for (const ent of fs.readdirSync(nm, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const p = path.join(nm, ent.name);
    if (ent.name.startsWith('@')) {
      for (const sub of fs.readdirSync(p, { withFileTypes: true })) {
        if (sub.isDirectory()) pruneAt(path.join(p, sub.name));
      }
    } else {
      pruneAt(p);
    }
  }
}

/** LICENSE / README / *.md in node_modules — not needed at runtime (often 10–40MB total). */
function prunePackageDocumentationFiles(standaloneRoot) {
  const nm = path.join(standaloneRoot, 'node_modules');
  if (!fs.existsSync(nm)) return;
  const baseNames = new Set([
    'README',
    'README.md',
    'readme.md',
    'CHANGELOG',
    'CHANGELOG.md',
    'History.md',
    'LICENSE',
    'LICENSE.md',
    'LICENCE',
    'AUTHORS',
    'CONTRIBUTORS',
  ]);
  walkFiles(nm, (file) => {
    const base = path.basename(file);
    if (baseNames.has(base) || base.endsWith('.md')) {
      try {
        fs.unlinkSync(file);
      } catch {
        /* ignore */
      }
    }
  });
}

function logSize(standaloneRoot) {
  try {
    const out = execSync(`du -sh "${standaloneRoot}" 2>/dev/null`, {
      encoding: 'utf8',
    });
    console.log('[prepare-lambda-standalone] size after prune:', out.trim());
  } catch {
    /* du unavailable */
  }
}

/** Sum file bytes (approximate Serverless zip unzipped payload for patterns we ship). */
function logPayloadBytes(standaloneRoot) {
  let total = 0;
  walkFiles(standaloneRoot, (f) => {
    try {
      total += fs.statSync(f).size;
    } catch {
      /* ignore */
    }
  });
  const lambdaJs = path.join(repoRoot, 'lambda.js');
  if (fs.existsSync(lambdaJs)) {
    try {
      total += fs.statSync(lambdaJs).size;
    } catch {
      /* ignore */
    }
  }
  const limit = 262144000;
  console.log(
    `[prepare-lambda-standalone] bytes (standalone + lambda.js) ~${total} (Lambda unzipped limit ${limit})`,
  );
  if (total > limit) {
    console.error(
      '[prepare-lambda-standalone] WARNING: raw file sum exceeds Lambda limit — deploy may still fail (zip differs slightly)',
    );
  }
}

if (!fs.existsSync(standalone)) {
  console.error(
    'Expected',
    standalone,
    '— run next build with output: "standalone"',
  );
  process.exit(1);
}

const deps = ['restana@4.9.9', 'serverless-http@4.0.0', 'serve-static@1.16.3'];
execSync(
  `npm install ${deps.join(' ')} --omit=dev --no-package-lock --ignore-scripts`,
  {
    cwd: standalone,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  },
);

const rootModules = path.join(repoRoot, 'node_modules');
const standaloneModules = path.join(standalone, 'node_modules');

function copyPkgIfMissing(name) {
  const dest = path.join(standaloneModules, name);
  if (fs.existsSync(dest)) return;
  const src = path.join(rootModules, name);
  if (!fs.existsSync(src)) {
    console.error(
      `[prepare-lambda-standalone] missing ${name} under standalone and repo node_modules`,
    );
    process.exit(1);
  }
  fs.mkdirSync(standaloneModules, { recursive: true });
  // Copy real files — do not leave symlinks into repo root (zip would follow them and balloon past 250MB).
  fs.cpSync(src, dest, { recursive: true, dereference: true });
  console.log(
    `[prepare-lambda-standalone] copied ${name} from repo node_modules (standalone install did not place it)`,
  );
}

/**
 * Replace EVERY symlink under standaloneRoot with a real copy of its target.
 *
 * Serverless uses fast-glob (followSymbolicLinks: true by default) to build the zip.
 * Any symlink — internal or external — can cause the same file tree to appear multiple
 * times in the archive, pushing the unzipped size past Lambda's 262 144 000 byte limit.
 * A full seal makes the zip content match exactly what `du` reports.
 */
function sealAllSymlinks(standaloneRoot) {
  let fixed = 0;
  function walk(p) {
    let entries;
    try {
      entries = fs.readdirSync(p, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(p, ent.name);
      if (ent.isSymbolicLink()) {
        let real;
        try {
          real = fs.realpathSync(full);
        } catch {
          // broken symlink — remove it so the zip doesn't error
          try {
            fs.unlinkSync(full);
          } catch {
            /* ignore */
          }
          continue;
        }
        try {
          const stat = fs.statSync(real);
          fs.unlinkSync(full);
          if (stat.isDirectory()) {
            fs.cpSync(real, full, { recursive: true, dereference: true });
          } else {
            fs.copyFileSync(real, full);
          }
          fixed += 1;
        } catch (e) {
          console.warn(
            '[prepare-lambda-standalone] could not seal symlink',
            full,
            '→',
            e.message,
          );
        }
      } else if (ent.isDirectory()) {
        walk(full);
      }
    }
  }
  walk(standaloneRoot);
  console.log(
    `[prepare-lambda-standalone] sealed ${fixed} symlink(s) → real copies (zip will match du size)`,
  );
}

for (const name of ['restana', 'serverless-http', 'serve-static']) {
  copyPkgIfMissing(name);
}

if (!fs.existsSync(path.join(standaloneModules, 'restana', 'package.json'))) {
  console.error(
    '[prepare-lambda-standalone] restana still missing after install + copy',
  );
  process.exit(1);
}

console.log(
  '[prepare-lambda-standalone] pruning maps + non-linux optional binaries…',
);
pruneSourceMaps(standalone);
pruneNextSwc(standalone);
pruneEsbuildVariants(standalone);
pruneSharpPrebuilds(standalone);
prunePackageDevTrees(standalone);
prunePackageDocumentationFiles(standalone);

// Seal after pruning: any remaining symlinks (internal or external) would be followed
// by fast-glob when serverless builds the zip, causing the unzipped size to exceed the
// Lambda limit even though `du` looks fine locally.
sealAllSymlinks(standalone);

logSize(standalone);
logPayloadBytes(standalone);
