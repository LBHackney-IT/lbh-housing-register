import {
  EMPTY_NON_ERROR_REJECTION_MESSAGE,
  shouldDropEmptyUnhandledRejection,
} from './shouldDropEmptyUnhandledRejection';

describe('shouldDropEmptyUnhandledRejection', () => {
  it('drops the empty non-Error UnhandledRejection Sentry captures', () => {
    expect(
      shouldDropEmptyUnhandledRejection({
        exception: {
          values: [
            {
              type: 'UnhandledRejection',
              value: EMPTY_NON_ERROR_REJECTION_MESSAGE,
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it('keeps UnhandledRejection events that include a rejection value', () => {
    expect(
      shouldDropEmptyUnhandledRejection({
        exception: {
          values: [
            {
              type: 'UnhandledRejection',
              value: 'Non-Error promise rejection captured with value: timeout',
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it('keeps Error exceptions even when the message is the word undefined', () => {
    expect(
      shouldDropEmptyUnhandledRejection({
        exception: {
          values: [{ type: 'Error', value: 'undefined' }],
        },
      }),
    ).toBe(false);
  });

  it('keeps events with no exception values', () => {
    expect(shouldDropEmptyUnhandledRejection({})).toBe(false);
    expect(shouldDropEmptyUnhandledRejection({ exception: {} })).toBe(false);
    expect(
      shouldDropEmptyUnhandledRejection({ exception: { values: [] } }),
    ).toBe(false);
  });

  it('ignores null exception entries and still drops a matching sibling', () => {
    expect(
      shouldDropEmptyUnhandledRejection({
        exception: {
          values: [
            null,
            {
              type: 'UnhandledRejection',
              value: EMPTY_NON_ERROR_REJECTION_MESSAGE,
            },
          ],
        },
      }),
    ).toBe(true);
  });
});
