/**
 * Strict type check for error object. This is being used as instantceof Error will not work in Safari in some circumstances.
 * @param {unknown} error
 * @returns {boolean}
 */

export const isAssignableToError = (error: unknown): boolean => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    'stack' in error
  );
};

/**
 * React will crash if an Error (or similar object) is rendered as a child.
 * Catch callbacks often receive that shape, so always return a string.
 */
export const toUserErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const message =
    typeof error === 'string'
      ? error
      : error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
        ? error.message
        : '';

  return message || fallback;
};
