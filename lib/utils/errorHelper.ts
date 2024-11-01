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
