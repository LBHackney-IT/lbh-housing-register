'use strict';
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

// Next standalone output (see next.config.js: output: 'standalone', distDir: 'build/_next')
const standaloneDir = path.join(__dirname, 'build', '_next', 'standalone');
const requireStandalone = createRequire(
  path.join(standaloneDir, 'package.json'),
);

process.env.NODE_ENV = 'production';

// The generated standalone/server.js embeds the full compiled nextConfig and sets
// process.env.__NEXT_PRIVATE_STANDALONE_CONFIG before booting.  All Next internals —
// including the router-server worker that calls setupFsCheck / filesystem.js — read
// their config from this env var.  Without it, loadConfig falls back to loading
// next.config.js from disk, which may fail silently in the standalone environment,
// and distDir defaults to '.next' (causing the "production build not found" error).
(function setStandaloneConfig() {
  const serverJs = fs.readFileSync(
    path.join(standaloneDir, 'server.js'),
    'utf8',
  );
  const PREFIX = 'const nextConfig = ';
  const SUFFIX = '\n\nprocess.env.__NEXT_PRIVATE_STANDALONE_CONFIG';
  const start = serverJs.indexOf(PREFIX) + PREFIX.length;
  const end = serverJs.indexOf(SUFFIX);
  if (start > PREFIX.length - 1 && end > start) {
    process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = serverJs.slice(start, end);
  } else {
    console.error(
      '[lambda] WARNING: could not extract nextConfig from standalone/server.js — ' +
        'server may fail to locate the production build',
    );
  }
})();

process.chdir(standaloneDir);

const next = requireStandalone('next');
const restana = requireStandalone('restana');
const serveStatic = requireStandalone('serve-static');
const serverless = requireStandalone('serverless-http');

const app = next({ dev: false, dir: standaloneDir });
const nextRequestHandler = app.getRequestHandler();

const server = restana();
server.use(serveStatic(path.join(standaloneDir, 'public')));
server.all('*', (req, res) => nextRequestHandler(req, res));

let prepared = false;
let handler;

module.exports.handler = async (event, context) => {
  if (!prepared) {
    await app.prepare();
    handler = serverless(server);
    prepared = true;
  }
  return handler(event, context);
};
