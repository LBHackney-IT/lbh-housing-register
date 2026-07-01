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

/** Mirrors HousingRegisterApi AuthEmailValidator + EmailAddressAttribute shape checks. */
function hasValidEmailFormat(email: string): boolean {
  const atIndex = email.indexOf('@');
  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (localPart.length === 0 || domainPart.length === 0) {
    return false;
  }

  const dotIndex = domainPart.indexOf('.');
  if (dotIndex <= 0 || dotIndex >= domainPart.length - 1) {
    return false;
  }

  return true;
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

  return hasValidEmailFormat(trimmed);
}
