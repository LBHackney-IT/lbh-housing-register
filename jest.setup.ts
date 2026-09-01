import '@testing-library/jest-dom';

process.env.NEXTAUTH_SECRET ??= 'test-nextauth-secret-at-least-32-bytes';
process.env.NEXTAUTH_URL ??= 'http://localhost:3000';
process.env.COGNITO_ISSUER ??=
  'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_test';
process.env.COGNITO_CLIENT_ID ??= 'test-client-id';
process.env.COGNITO_CLIENT_SECRET ??= 'test-client-secret';
process.env.COGNITO_DOMAIN ??= 'https://test.auth.eu-west-2.amazoncognito.com';
