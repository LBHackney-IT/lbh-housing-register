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

const standalone = path.join(__dirname, '..', 'build', '_next', 'standalone');

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

console.log(
  '[prepare-lambda-standalone] pruning maps + non-linux optional binaries…',
);
pruneSourceMaps(standalone);
pruneNextSwc(standalone);
pruneEsbuildVariants(standalone);
pruneSharpPrebuilds(standalone);

logSize(standalone);
