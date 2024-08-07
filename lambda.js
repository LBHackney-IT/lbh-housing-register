const server = require('restana')();
const app = require('next')({ dev: false });
const files = require('serve-static');

const path = require('path');

const nextRequestHandler = app.getRequestHandler();

server.use(files(path.join(__dirname, 'build')));
server.use(files(path.join(__dirname, 'public')));

server.all('*', (req, res) => nextRequestHandler(req, res));

module.exports.handler = require('serverless-http')(server);
