/**
 * After `next build` (output: 'standalone'):
 * 1) Install serverless-http into the traced bundle.
 * 2) Prune paths that inflate the zip but are not needed on AWS Lambda linux x64.
 *
 * Lambda hard limit: unzipped deployment package < 262144000 bytes (~250 MB).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const standalone = path.join(repoRoot, 'build', '_next', 'standalone');
const standaloneModules = path.join(standalone, 'node_modules');
const rootModules = path.join(repoRoot, 'node_modules');

// ─── helpers ────────────────────────────────────────────────────────────────

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

function dirBytes(dir) {
  let bytes = 0;
  walkFiles(dir, (f) => {
    try {
      bytes += fs.statSync(f).size;
    } catch {
      /* ignore */
    }
  });
  return bytes;
}

/** Remove entries from a scoped node_modules directory that match the predicate. */
function pruneScope(scope, removeFn) {
  const dir = path.join(standaloneModules, scope);
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (removeFn(name)) rmRecursive(path.join(dir, name));
  }
}

/**
 * Replace every symlink under root with a real copy of its target.
 *
 * Serverless uses fast-glob (followSymbolicLinks: true) to build the zip.
 * Any symlink — internal or external — can cause the same file tree to appear
 * multiple times in the archive, pushing the unzipped size past Lambda's limit.
 * A full seal makes the zip content match exactly what `du` reports.
 */
function sealAllSymlinks(root) {
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
          if (stat.isDirectory())
            fs.cpSync(real, full, { recursive: true, dereference: true });
          else fs.copyFileSync(real, full);
          fixed++;
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
  walk(root);
  console.log(
    `[prepare-lambda-standalone] sealed ${fixed} symlink(s) → real copies (zip will match du size)`,
  );
}

/** Log the 15 largest packages in node_modules to help diagnose future size regressions. */
function logTopPackages() {
  if (!fs.existsSync(standaloneModules)) return;
  const sizes = [];
  for (const ent of fs.readdirSync(standaloneModules, {
    withFileTypes: true,
  })) {
    if (!ent.isDirectory()) continue;
    const p = path.join(standaloneModules, ent.name);
    if (ent.name.startsWith('@')) {
      for (const sub of fs.readdirSync(p, { withFileTypes: true })) {
        if (sub.isDirectory()) {
          sizes.push({
            name: `${ent.name}/${sub.name}`,
            bytes: dirBytes(path.join(p, sub.name)),
          });
        }
      }
    } else {
      sizes.push({ name: ent.name, bytes: dirBytes(p) });
    }
  }
  sizes.sort((a, b) => b.bytes - a.bytes);
  console.log('[prepare-lambda-standalone] top 15 packages by size:');
  for (const { name, bytes } of sizes.slice(0, 15)) {
    console.log(
      `  ${(bytes / 1024 / 1024).toFixed(1).padStart(7)} MB  ${name}`,
    );
  }
}

// ─── validate ───────────────────────────────────────────────────────────────

if (!fs.existsSync(standalone)) {
  console.error(
    'Expected',
    standalone,
    '— run next build with output: "standalone"',
  );
  process.exit(1);
}

// ─── install runtime deps ────────────────────────────────────────────────────

// serverless-http is the only runtime dependency not traced by Next standalone output.
execSync(
  'npm install serverless-http@4.0.0 --omit=dev --no-package-lock --ignore-scripts',
  {
    cwd: standalone,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  },
);

// Fallback: copy from repo node_modules if npm placed it elsewhere.
const serverlessHttpDest = path.join(standaloneModules, 'serverless-http');
if (!fs.existsSync(serverlessHttpDest)) {
  const src = path.join(rootModules, 'serverless-http');
  if (!fs.existsSync(src)) {
    console.error(
      '[prepare-lambda-standalone] serverless-http missing after install — cannot continue',
    );
    process.exit(1);
  }
  fs.cpSync(src, serverlessHttpDest, { recursive: true, dereference: true });
  console.log(
    '[prepare-lambda-standalone] copied serverless-http from repo node_modules',
  );
}

// ─── seal then prune ─────────────────────────────────────────────────────────
//
// Seal BEFORE pruning so that symlink targets (e.g. platform-specific swc/esbuild/sharp
// binaries pulled in from CI node_modules) are replaced with real files and then pruned.

sealAllSymlinks(standalone);

console.log(
  '[prepare-lambda-standalone] pruning maps, docs + non-linux optional binaries…',
);

// Single pass: drop source maps and package documentation files.
const DOC_NAMES = new Set([
  'README',
  'CHANGELOG',
  'LICENSE',
  'LICENCE',
  'AUTHORS',
  'CONTRIBUTORS',
]);
walkFiles(standalone, (f) => {
  const base = path.basename(f);
  if (f.endsWith('.map') || DOC_NAMES.has(base) || base.endsWith('.md')) {
    try {
      fs.unlinkSync(f);
    } catch {
      /* ignore */
    }
  }
});

// @next/swc-* Rust compiler binaries (~100 MB on Linux). swc is build-time only.
pruneScope('@next', (n) => n.startsWith('swc-'));
// @esbuild ships per-OS; keep linux x64 only.
pruneScope('@esbuild', (n) => !n.includes('linux-x64'));
// @img optional prebuilds — Lambda is linux x64 glibc.
pruneScope('@img', (n) => /darwin|win32|linux-arm64|musl|freebsd/i.test(n));

// Drop test / example / docs trees inside each package.
const JUNK_DIRS = new Set([
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
if (fs.existsSync(standaloneModules)) {
  for (const ent of fs.readdirSync(standaloneModules, {
    withFileTypes: true,
  })) {
    if (!ent.isDirectory()) continue;
    const pkgRoot = path.join(standaloneModules, ent.name);
    const pruneAt = (dir) => {
      for (const j of JUNK_DIRS) rmRecursive(path.join(dir, j));
    };
    if (ent.name.startsWith('@')) {
      for (const sub of fs.readdirSync(pkgRoot, { withFileTypes: true })) {
        if (sub.isDirectory()) pruneAt(path.join(pkgRoot, sub.name));
      }
    } else {
      pruneAt(pkgRoot);
    }
  }
}

// ─── size report ─────────────────────────────────────────────────────────────

try {
  const out = execSync(`du -sh "${standalone}" 2>/dev/null`, {
    encoding: 'utf8',
  });
  console.log('[prepare-lambda-standalone] size after prune:', out.trim());
} catch {
  /* du unavailable */
}

logTopPackages();

const LAMBDA_LIMIT = 262144000;
let total = dirBytes(standalone);
try {
  total += fs.statSync(path.join(repoRoot, 'lambda.js')).size;
} catch {
  /* ignore */
}
console.log(
  `[prepare-lambda-standalone] bytes (standalone + lambda.js) ~${total} (Lambda unzipped limit ${LAMBDA_LIMIT})`,
);
if (total > LAMBDA_LIMIT) {
  console.error(
    '[prepare-lambda-standalone] WARNING: raw file sum exceeds Lambda limit — deploy may still fail',
  );
}
