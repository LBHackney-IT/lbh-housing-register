export const EMPTY_NON_ERROR_REJECTION_MESSAGE =
  'Non-Error promise rejection captured with value: undefined';

export type SentryExceptionEvent = {
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
    } | null>;
  };
};

/**
 * Sentry's browser GlobalHandlers turn `Promise.reject()` / `reject(undefined)`
 * into this UnhandledRejection event. There is no Error, no stack, and nothing
 * for us to fix in app code.
 */
export function shouldDropEmptyUnhandledRejection(
  event: SentryExceptionEvent,
): boolean {
  const values = event.exception?.values;
  if (!values?.length) {
    return false;
  }

  return values.some(
    (item) =>
      item?.type === 'UnhandledRejection' &&
      item.value === EMPTY_NON_ERROR_REJECTION_MESSAGE,
  );
}
