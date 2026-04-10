const path = require('path');
const { createRequire } = require('module');

// Next standalone output (see next.config.js output: 'standalone', distDir: 'build/_next')
const standaloneDir = path.join(__dirname, 'build', '_next', 'standalone');
// `process.chdir` does NOT change `require()` resolution; deps live under standalone/node_modules.
const requireStandalone = createRequire(
  path.join(standaloneDir, 'package.json'),
);

process.chdir(standaloneDir);

const server = requireStandalone('restana')();
const next = requireStandalone('next');
const files = requireStandalone('serve-static');

const app = next({ dev: false, dir: standaloneDir });
const nextRequestHandler = app.getRequestHandler();

server.use(files(path.join(standaloneDir, 'public')));

server.all('*', (req, res) => nextRequestHandler(req, res));

const serverless = requireStandalone('serverless-http');

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
