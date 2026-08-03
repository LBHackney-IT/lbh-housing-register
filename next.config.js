// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lbh-frontend'],
  // Disable compression at the Next level to avoid NS_ERROR_CORRUPTED_CONTENT.
  // CloudFront handles compression.
  compress: false,
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
  // SENTRY_AUTH_TOKEN, SENTRY_PROJECT, and SENTRY_ORG are all set in the housing-register-fe-build-context during the build proceess and are not necassary to be set here.
  // Verbose in CI so upload/warning logs are visible there; quiet for local dev builds.
  silent: !process.env.CI,
  hideSourceMaps: true, // Will make sourcemaps invisible to the browser.
});
