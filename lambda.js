'use strict';
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

// Next standalone output (next.config.js: output: 'standalone', distDir: 'build/_next')
const standaloneDir = path.join(__dirname, 'build', '_next', 'standalone');
const requireStandalone = createRequire(
  path.join(standaloneDir, 'package.json'),
);

process.env.NODE_ENV = 'production';

// Mirror what standalone/server.js does: set __NEXT_PRIVATE_STANDALONE_CONFIG so that
// all Next internals (including the router-server worker / filesystem.js setupFsCheck)
// load the correct distDir and config rather than falling back to the '.next' default.
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
    // Override compress: withSentryConfig does not forward the compress key from
    // next.config.js so the embedded config always has compress:true.  Gzip bodies
    // through API Gateway → NS_ERROR_CORRUPTED_CONTENT; CloudFront compresses at the edge.
    const config = JSON.parse(serverJs.slice(start, end));
    config.compress = false;
    process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);
  } else {
    console.error(
      '[lambda] WARNING: could not extract nextConfig from server.js',
    );
  }
})();

process.chdir(standaloneDir);

const next = requireStandalone('next');
const serverlessHttp = requireStandalone('serverless-http');

const app = next({ dev: false, dir: standaloneDir });
let handler;

module.exports.handler = async (event, context) => {
  if (!handler) {
    await app.prepare();
    const requestHandler = app.getRequestHandler();
    handler = serverlessHttp((req, res) => requestHandler(req, res));
  }
  return handler(event, context);
};
