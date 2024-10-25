import http from 'http';

import { devServer } from '@cypress/webpack-dev-server';
import { defineConfig } from 'cypress';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import next from 'next';
import nock from 'nock';

import { unlinkSync } from 'fs';

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
        nock: async ({
          hostname,
          method,
          path,
          statusCode,
          body,
          persist,
          delay,
        }) => {
          if (!nock.isActive()) {
            nock.activate();
          }

          // leaving this here for debugging purposes.
          // console.log(
          //   'nock will: %s %s%s respond with %d %o',
          //   method,
          //   hostname,
          //   path,
          //   persist,
          //   statusCode,
          //   body,
          //   delay
          // );
          method = method.toLowerCase();

          nock(hostname)
            [method](path)
            .delay(delay ?? 0)
            .reply(statusCode, body)
            .persist(!!persist);

          return null;
        },
      });
      if (config.video) {
        // delete video if test failed
        on('after:spec', (spec, results) => {
          if (results.video) {
            if (results.stats.failures || results.stats.skipped) {
              console.log('keeping the video %s', results.video);
            } else {
              unlinkSync(results.video);
            }
          }
        });
      }
      config.env = {
        ...process.env,
      };
      return config;
    },
    baseUrl,
    experimentalWebKitSupport: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    // excludeSpecPattern: process.env.PIPELINE ? ['.cypress/e2e/local/**/*'] : [],
    // video: true,
    // videoCompression: true,
  },
  component: {
    experimentalJustInTimeCompile: true,
    devServer: (devServerConfig) => {
      return devServer({
        ...devServerConfig,
        framework: 'next',
        // bundler: 'webpack',
      });
    },
  },
  // component: {
  //   devServer: devServer({
  //     framework: 'next',
  //     bundler: 'webpack',
  //   }),
  // },
});
