const path = require('path');

// Next standalone output (see next.config.js output: 'standalone', distDir: 'build/_next')
const standaloneDir = path.join(__dirname, 'build', '_next', 'standalone');
process.chdir(standaloneDir);

const server = require('restana')();
const next = require('next');
const files = require('serve-static');

const app = next({ dev: false, dir: standaloneDir });
const nextRequestHandler = app.getRequestHandler();

server.use(files(path.join(standaloneDir, 'public')));

server.all('*', (req, res) => nextRequestHandler(req, res));

const serverless = require('serverless-http');

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
