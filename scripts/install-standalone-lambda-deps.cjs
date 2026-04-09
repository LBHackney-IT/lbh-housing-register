/**
 * After `next build` with output: 'standalone', install the thin HTTP wrapper deps
 * into the traced bundle so we do not ship the full repo node_modules to Lambda.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const standalone = path.join(__dirname, '..', 'build', '_next', 'standalone');
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
