import { defineConfig } from 'cypress';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';

const baseUrl = 'http://localhost:3000';

export default defineConfig({
  e2e: {
    baseUrl,
    experimentalWebKitSupport: true,
    setupNodeEvents(on, config) {
      on('task', {
        generateToken({ user, secret }) {
          return sign(user, secret);
        },
      });
      config.env = {
        ...process.env,
      };
      return config;
    },
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
