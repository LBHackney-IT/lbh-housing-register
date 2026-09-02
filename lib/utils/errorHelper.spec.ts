import { toUserErrorMessage } from './errorHelper';

describe('toUserErrorMessage', () => {
  const fallback = 'Unable to complete request';

  it('returns a non-empty string as-is', () => {
    expect(
      toUserErrorMessage('Unable to create verify code (500)', fallback),
    ).toBe('Unable to create verify code (500)');
  });

  it('uses Error.message', () => {
    expect(toUserErrorMessage(new Error('Network failed'), fallback)).toBe(
      'Network failed',
    );
  });

  it('uses SerializedError.message when stack is missing', () => {
    expect(
      toUserErrorMessage(
        { name: 'TypeError', message: 'Failed to fetch' },
        fallback,
      ),
    ).toBe('Failed to fetch');
  });

  it('falls back for empty strings, objects without a message, and other values', () => {
    expect(toUserErrorMessage('', fallback)).toBe(fallback);
    expect(toUserErrorMessage({}, fallback)).toBe(fallback);
    expect(toUserErrorMessage(undefined, fallback)).toBe(fallback);
  });
});
