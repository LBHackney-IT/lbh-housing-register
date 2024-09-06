import http from 'http';

import { defineConfig } from 'cypress';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import next from 'next';
import nock from 'nock';

const baseUrl = 'http://localhost:3000';

export default defineConfig({
  e2e: {
    // this is configured this way due to server side mocking. See https://glebbahmutov.com/blog/mock-network-from-server/
    async setupNodeEvents(on, config) {
      const app = next({ dev: true });
      const handleNextRequests = app.getRequestHandler();
      await app.prepare();

      const customServer = new http.Server(async (req, res) => {
        return handleNextRequests(req, res);
      });

      await new Promise<void>((resolve, reject) => {
        customServer
          .listen(3000, () => {
            console.log(
              '> Server opened from Cypress. Ready on http://localhost:3000'
            );
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
      on('task', {
        generateToken({ user, secret }) {
          return sign(user, secret);
        },
      });
      on('task', {
        clearNock() {
          nock.restore();
          nock.cleanAll();

          return null;
        },
      });
      on('task', {
        nock: async ({ hostname, method, path, statusCode, body }) => {
          if (!nock.isActive()) {
            nock.activate();
          }
          // leaving this here for debugging purposes.
          // console.log(
          //   'nock will: %s %s%s respond with %d %o',
          //   method,
          //   hostname,
          //   path,
          //   statusCode,
          //   body
          // );
          method = method.toLowerCase();
          nock(hostname)[method](path).reply(statusCode, body);

          return null;
        },
      });
      config.env = {
        ...process.env,
      };
      return config;
    },
    baseUrl,
    experimentalWebKitSupport: true,
    video: true,
    screenshotOnRunFailure: true,
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
