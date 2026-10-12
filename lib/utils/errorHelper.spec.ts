import { toUserErrorMessage, UserFacingError } from './errorHelper';

describe('toUserErrorMessage', () => {
  const fallback = 'Unable to complete request';

  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('returns a rejectWithValue string as-is', () => {
    expect(
      toUserErrorMessage('Unable to create verify code (500)', fallback),
    ).toBe('Unable to create verify code (500)');
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('returns the message of an error the API wrote for the user', () => {
    expect(
      toUserErrorMessage(
        new UserFacingError('Supplied bidding number "1234567" is reserved'),
        fallback,
      ),
    ).toBe('Supplied bidding number "1234567" is reserved');
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('logs a dropped connection instead of showing it', () => {
    const error = new TypeError('Failed to fetch');

    expect(toUserErrorMessage(error, fallback)).toBe(fallback);
    expect(consoleError).toHaveBeenCalledWith(fallback, error);
  });

  it('logs a JSON parse failure instead of showing it', () => {
    const error = new SyntaxError('Unexpected token < in JSON at position 0');

    expect(toUserErrorMessage(error, fallback)).toBe(fallback);
    expect(consoleError).toHaveBeenCalledWith(fallback, error);
  });

  it('hides the message of an unmarked error, however readable it looks', () => {
    expect(toUserErrorMessage(new Error('Load failed'), fallback)).toBe(
      fallback,
    );
    expect(
      toUserErrorMessage(
        { name: 'TypeError', message: 'Load failed' },
        fallback,
      ),
    ).toBe(fallback);
  });

  it('falls back for empty strings, objects without a message, and other values', () => {
    expect(toUserErrorMessage('', fallback)).toBe(fallback);
    expect(toUserErrorMessage({}, fallback)).toBe(fallback);
    expect(toUserErrorMessage(undefined, fallback)).toBe(fallback);
  });

  it('always returns a string, so React is never handed an error object', () => {
    [
      'a string',
      new UserFacingError('marked'),
      new Error('unmarked'),
      { message: {} },
      null,
      undefined,
      42,
    ].forEach((value) => {
      expect(typeof toUserErrorMessage(value, fallback)).toBe('string');
    });
  });
});
