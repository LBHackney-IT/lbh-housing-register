import {
  INVALID_AUTH_EMAIL_MESSAGE,
  isValidAuthEmail,
} from './auth-email-validator';

describe('isValidAuthEmail', () => {
  it.each([
    'resident@hackney.gov.uk',
    'user.name+tag@example.com',
    '  resident@hackney.gov.uk  ',
  ])('returns true for valid email addresses (%s)', (email) => {
    expect(isValidAuthEmail(email)).toBe(true);
  });

  it.each([
    '',
    '   ',
    'not-an-email',
    "' OR 1=1; --",
    "scanner@prbly.win'; DROP TABLE users; --",
    '@missing-local-part.com',
    'missing-domain@',
  ])('returns false for invalid email addresses (%s)', (email) => {
    expect(isValidAuthEmail(email)).toBe(false);
  });

  it('returns false when email exceeds max length', () => {
    const email = `${'a'.repeat(250)}@example.com`;
    expect(isValidAuthEmail(email)).toBe(false);
  });

  it('exports the backend error message', () => {
    expect(INVALID_AUTH_EMAIL_MESSAGE).toBe('Email address is not valid.');
  });
});
