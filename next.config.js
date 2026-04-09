// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build/_next',
  // Trace production deps into build/_next/standalone so the Lambda zip stays under 250MB unzipped.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(nextConfig, {
  // Senty token, project, and org are all set in the build proceess and are not necassary to be set here.
  silent: true, // Suppresses all logs
  hideSourceMaps: true, // Will make sourcemaps invisible to the browser.
});
