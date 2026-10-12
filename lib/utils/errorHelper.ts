/**
 * An error whose message was written to be read by a resident or an officer,
 * e.g. a validation response from the housing API. Anything else - a dropped
 * connection, an HTML error page where JSON was expected, an unexpected
 * exception - carries a techinical browser message of no user value.
 */
export class UserFacingError extends Error {
  readonly isUserFacing = true;

  constructor(message: string) {
    // This is only here so console.error > Sentry show that it is a
    // UserFacingError instead of Error.
    super(message);
    this.name = 'UserFacingError';
  }
}

const hasUserFacingMessage = (error: unknown): error is { message: string } =>
  error !== null &&
  typeof error === 'object' &&
  (error as { isUserFacing?: unknown }).isUserFacing === true &&
  typeof (error as { message?: unknown }).message === 'string' &&
  (error as { message: string }).message !== '';

/**
 * Turns anything a catch block receives into a string that is safe to render.
 *
 * Crafted messages (thunk `rejectWithValue` strings and `UserFacingError`)
 * are shown as they are. Everything else is logged with the original error and
 * replaced with `fallback`, so the technical detail reaches the console but
 * not to users on the page.
 */
export const toUserErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (typeof error === 'string' && error !== '') {
    return error;
  }

  if (hasUserFacingMessage(error)) {
    return error.message;
  }

  console.error(fallback, error);

  return fallback;
};
