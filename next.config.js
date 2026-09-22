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
      // Staff pages can include session cookies. Do not let browsers or
      // CloudFront reuse a previous user's dashboard response.
      {
        source: '/applications/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, max-age=0',
          },
        ],
      },
      // NextAuth callback/session responses must not be cached.
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, max-age=0',
          },
        ],
      },
      // Resident OTP generate/verify/exit set the housing_user cookie.
      {
        source: '/api/resident-auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, max-age=0',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Restrict embedding. Complements X-Frame-Options for modern browsers.
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
          // Do not leak the full URL (including OAuth query strings) to other origins.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
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
