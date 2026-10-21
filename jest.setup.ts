import '@testing-library/jest-dom';

jest.mock('@sentry/nextjs', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  captureRequestError: jest.fn(),
  captureRouterTransitionStart: jest.fn(),
  captureUnderscoreErrorException: jest.fn(),
  flush: jest.fn(() => Promise.resolve(true)),
  init: jest.fn(),
  setTag: jest.fn(),
  setUser: jest.fn(),
  ErrorBoundary: ({ children }: { children?: unknown }) => children ?? null,
}));

process.env.NEXTAUTH_SECRET ??= 'test-nextauth-secret-at-least-32-bytes';
process.env.NEXTAUTH_URL ??= 'http://localhost:3000';
process.env.COGNITO_ISSUER ??=
  'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_test';
process.env.COGNITO_CLIENT_ID ??= 'test-client-id';
process.env.COGNITO_CLIENT_SECRET ??= 'test-client-secret';
process.env.COGNITO_DOMAIN ??= 'https://test.auth.eu-west-2.amazoncognito.com';
