export const INVALID_AUTH_EMAIL_MESSAGE = 'Email address is not valid.';

const MAX_EMAIL_LENGTH = 254;

const DISALLOWED_CHARACTERS = [
  "'",
  '"',
  ';',
  '<',
  '>',
  '(',
  ')',
  '\\',
  '\r',
  '\n',
  '\0',
  ' ',
];

/** Mirrors HousingRegisterApi AuthEmailValidator rules. */
const EMAIL_FORMAT = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function containsDisallowedCharacter(value: string): boolean {
  return DISALLOWED_CHARACTERS.some((character) => value.includes(character));
}

export function isValidAuthEmail(email: unknown): email is string {
  if (typeof email !== 'string' || email.trim() === '') {
    return false;
  }

  const trimmed = email.trim();

  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  if (containsDisallowedCharacter(trimmed)) {
    return false;
  }

  if ((trimmed.match(/@/g) ?? []).length !== 1) {
    return false;
  }

  return EMAIL_FORMAT.test(trimmed);
}
