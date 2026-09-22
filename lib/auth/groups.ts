/**
 * Cognito receives Google Workspace groups from the pre-token-generation
 * Lambda in `custom:groups`. The trigger serialises the claim, so accept the
 * JSON-array, semicolon-delimited, and comma-delimited forms.
 *
 * Hackney's trigger uses semicolons, and group names such as
 * "Here to Help (User Dev)" may themselves contain a comma, so a semicolon
 * takes precedence when present.
 */
export function parseCognitoGroups(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((group): group is string => typeof group === 'string');
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (group): group is string => typeof group === 'string',
      );
    }
  } catch {
    // Fall through to the delimiter format.
  }

  const delimited = value.replace(/^\[|\]$/g, '');

  return delimited
    .split(delimited.includes(';') ? ';' : ',')
    .map((group) => group.trim())
    .filter(Boolean);
}
