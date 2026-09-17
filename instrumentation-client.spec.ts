const mockInit = jest.fn();

jest.mock('@sentry/nextjs', () => ({
  init: (...args: unknown[]) => mockInit(...args),
  captureConsoleIntegration: jest.fn(() => ({ name: 'CaptureConsole' })),
  captureRouterTransitionStart: jest.fn(),
}));

describe('instrumentation-client beforeSend', () => {
  let beforeSend: (event: Record<string, unknown>) => unknown;

  beforeAll(async () => {
    await import('./instrumentation-client');
    beforeSend = mockInit.mock.calls[0][0].beforeSend;
  });

  it('does not send empty non-Error unhandled rejections', () => {
    expect(
      beforeSend({
        exception: {
          values: [
            {
              type: 'UnhandledRejection',
              value:
                'Non-Error promise rejection captured with value: undefined',
            },
          ],
        },
      }),
    ).toBeNull();
  });

  it('still sends application errors after stripping auth cookies', () => {
    const event = {
      exception: {
        values: [
          { type: 'TypeError', value: 'Cannot read properties of null' },
        ],
      },
      request: {
        cookies: {
          hackneyToken: 'token',
          housing_user: 'user',
          other: 'kept',
        },
      },
    };

    expect(beforeSend(event)).toBe(event);
    expect(event.request.cookies).toEqual({ other: 'kept' });
  });
});
