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

function containsDisallowedCharacter(value: string): boolean {
  return DISALLOWED_CHARACTERS.some((character) => value.includes(character));
}

/** Mirrors HousingRegisterApi AuthEmailValidator rules. */
export function isValidAuthEmail(email: string): boolean {
  const trimmed = email.trim();

  if (trimmed === '') {
    return false;
  }

  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  if (containsDisallowedCharacter(trimmed)) {
    return false;
  }

  const atIndex = trimmed.indexOf('@');
  if (atIndex === -1 || trimmed.includes('@', atIndex + 1)) {
    return false;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (localPart.length === 0 || domainPart.length === 0) {
    return false;
  }

  const dotIndex = domainPart.indexOf('.');
  if (dotIndex <= 0 || dotIndex >= domainPart.length - 1) {
    return false;
  }

  return true;
}
