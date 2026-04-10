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

/**
 * Remove entries from a scoped node_modules directory (@next, @esbuild, @img, …)
 * that match the given predicate.
 */
function pruneScope(scope, removeFn) {
  const dir = path.join(standaloneModules, scope);
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (removeFn(name)) rmRecursive(path.join(dir, name));
  }
}

// ─── prune functions ────────────────────────────────────────────────────────

/**
 * Drop all @next/swc-* Rust compiler binaries (~100 MB on Linux).
 * swc is only used during `next build`; the pre-built standalone never recompiles at runtime.
 */
function pruneNextSwc() {
  pruneScope('@next', (n) => n.startsWith('swc-'));
}

/** @esbuild ships per-OS; keep linux x64 only. */
function pruneEsbuildVariants() {
  pruneScope('@esbuild', (n) => !n.includes('linux-x64'));
}

/** @img optional prebuilds — Lambda uses linux x64 glibc; drop all other OS/arch variants. */
function pruneSharpPrebuilds() {
  pruneScope('@img', (n) => /darwin|win32|linux-arm64|musl|freebsd/i.test(n));
}

/** Remove test / example / docs trees inside each package (never needed at runtime). */
function prunePackageDevTrees() {
  if (!fs.existsSync(standaloneModules)) return;
  const junk = new Set([
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
  const pruneAt = (pkgRoot) => {
    for (const j of junk) rmRecursive(path.join(pkgRoot, j));
  };
  for (const ent of fs.readdirSync(standaloneModules, {
    withFileTypes: true,
  })) {
    if (!ent.isDirectory()) continue;
    const p = path.join(standaloneModules, ent.name);
    if (ent.name.startsWith('@')) {
      for (const sub of fs.readdirSync(p, { withFileTypes: true })) {
        if (sub.isDirectory()) pruneAt(path.join(p, sub.name));
      }
    } else {
      pruneAt(p);
    }
  }
}

/** Remove LICENSE / README / *.md in node_modules (often 10–40 MB total). */
function prunePackageDocumentationFiles() {
  if (!fs.existsSync(standaloneModules)) return;
  // bare names without extension; all .md files are caught by endsWith below
  const docFiles = new Set([
    'README',
    'CHANGELOG',
    'LICENSE',
    'LICENCE',
    'AUTHORS',
    'CONTRIBUTORS',
  ]);
  walkFiles(standaloneModules, (file) => {
    const base = path.basename(file);
    if (docFiles.has(base) || base.endsWith('.md')) {
      try {
        fs.unlinkSync(file);
      } catch {
        /* ignore */
      }
    }
  });
}

// ─── symlink sealing ────────────────────────────────────────────────────────

/**
 * Replace EVERY symlink under standaloneRoot with a real copy of its target.
 *
 * Serverless uses fast-glob (followSymbolicLinks: true) to build the zip.
 * Any symlink — internal or external — can cause the same file tree to appear
 * multiple times in the archive, pushing the unzipped size past Lambda's limit.
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

// ─── logging ────────────────────────────────────────────────────────────────

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

/** Approximate unzipped payload size and warn if it exceeds Lambda's limit. */
function logPayloadBytes(standaloneRoot) {
  let total = dirBytes(standaloneRoot);
  try {
    total += fs.statSync(path.join(repoRoot, 'lambda.js')).size;
  } catch {
    /* ignore */
  }
  const limit = 262144000;
  console.log(
    `[prepare-lambda-standalone] bytes (standalone + lambda.js) ~${total} (Lambda unzipped limit ${limit})`,
  );
  if (total > limit) {
    console.error(
      '[prepare-lambda-standalone] WARNING: raw file sum exceeds Lambda limit — deploy may still fail',
    );
  }
}

// ─── runtime dep install ────────────────────────────────────────────────────

if (!fs.existsSync(standalone)) {
  console.error(
    'Expected',
    standalone,
    '— run next build with output: "standalone"',
  );
  process.exit(1);
}

// Only serverless-http is needed at runtime; restana and serve-static are no longer used
// (Next.js's own request handler serves public/ files and /_next/static/ directly).
execSync(
  'npm install serverless-http@4.0.0 --omit=dev --no-package-lock --ignore-scripts',
  {
    cwd: standalone,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  },
);

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
  fs.cpSync(src, dest, { recursive: true, dereference: true });
  console.log(
    `[prepare-lambda-standalone] copied ${name} from repo node_modules`,
  );
}

copyPkgIfMissing('serverless-http');

if (
  !fs.existsSync(
    path.join(standaloneModules, 'serverless-http', 'package.json'),
  )
) {
  console.error(
    '[prepare-lambda-standalone] serverless-http missing after install + copy',
  );
  process.exit(1);
}

// ─── seal then prune ────────────────────────────────────────────────────────
//
// Seal BEFORE pruning so that symlink targets (e.g. platform-specific swc/esbuild/sharp
// binaries pulled in from CI node_modules) are replaced with real files and then pruned.
// Sealing after pruning caused CI to balloon ~127 MB because newly-materialised dirs
// were never cleaned up.

sealAllSymlinks(standalone);

console.log(
  '[prepare-lambda-standalone] pruning maps + non-linux optional binaries…',
);
walkFiles(standalone, (f) => {
  if (f.endsWith('.map'))
    try {
      fs.unlinkSync(f);
    } catch {
      /* ignore */
    }
});
pruneNextSwc();
pruneEsbuildVariants();
pruneSharpPrebuilds();
prunePackageDevTrees();
prunePackageDocumentationFiles();

logSize(standalone);
logTopPackages();
logPayloadBytes(standalone);
