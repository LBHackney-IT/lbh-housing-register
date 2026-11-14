import * as Sentry from '@sentry/nextjs';
import type { Event } from '@sentry/nextjs';

import { sanitiseSentryEvent } from '../utils/sentry-privacy';
import {
  installSameUrlHardNavigationRecovery,
  isSameUrlHardNavigationError,
  onSameUrlHardNavigationRejection,
  recoverSameUrlHardNavigation,
  SAME_URL_HARD_NAVIGATION_PREFIX,
  sameUrlHardNavigation,
  shouldDropRecoveredHardNavigation,
} from './recover-same-url-hard-navigation';
import '../../instrumentation-client';

const STORAGE_KEY = 'housing-register:same-url-hard-navigation';
const INSTALLED_FLAG = '__housingRegisterSameUrlHardNavigationInstalled';
const RECOVERED_FLAG = '__housingRegisterSameUrlHardNavigationRecovered';

const hardNavigationError = () =>
  new Error(
    `${SAME_URL_HARD_NAVIGATION_PREFIX} /applications/unassigned https://housing-register.hackney.gov.uk/applications/unassigned`,
  );

const clientOptions = (Sentry.init as jest.Mock).mock.calls
  .map(
    (call) =>
      call[0] as {
        tunnel?: string;
        beforeSend?: (
          event: Event,
          hint?: { originalException?: unknown },
        ) => Event | null;
      },
  )
  .find((options) => options.tunnel === '/monitoring');

describe('same-URL hard navigation recovery', () => {
  const reload = jest.fn();

  beforeEach(() => {
    reload.mockReset();
    sessionStorage.clear();
    const browserWindow = window as unknown as Record<string, unknown>;
    delete browserWindow[INSTALLED_FLAG];
    delete browserWindow[RECOVERED_FLAG];
    window.removeEventListener(
      'unhandledrejection',
      onSameUrlHardNavigationRejection,
    );
    jest
      .spyOn(sameUrlHardNavigation, 'reloadDocument')
      .mockImplementation(reload);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('recognises only this Next.js invariant', () => {
    expect(isSameUrlHardNavigationError('Invariant')).toBe(false);
    expect(isSameUrlHardNavigationError(null)).toBe(false);
    expect(isSameUrlHardNavigationError({})).toBe(false);
    expect(isSameUrlHardNavigationError({ message: 1 })).toBe(false);
    expect(isSameUrlHardNavigationError(new Error('navigation failed'))).toBe(
      false,
    );
    expect(isSameUrlHardNavigationError(hardNavigationError())).toBe(true);
  });

  it('reloads once so the browser loads the new build', () => {
    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 1_000),
    ).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('1000');
    expect(shouldDropRecoveredHardNavigation({}, hardNavigationError())).toBe(
      true,
    );
  });

  it('reloads the document when no reload function is passed', () => {
    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), undefined, 1_000),
    ).toBe(true);
    expect(sameUrlHardNavigation.reloadDocument).toHaveBeenCalledTimes(1);
  });

  it('asks the browser to reload the current document', () => {
    jest.restoreAllMocks();
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    sameUrlHardNavigation.reloadDocument();

    const reported = error.mock.calls[0]?.[0] as Error;
    expect(reported.message).toContain('Not implemented: navigation');
  });

  it('does not reload a different rejection', () => {
    expect(recoverSameUrlHardNavigation(new Error('other'), reload)).toBe(
      false,
    );
    expect(reload).not.toHaveBeenCalled();
    expect(
      shouldDropRecoveredHardNavigation(
        { exception: { values: [{ value: 'other' }] } },
        new Error('other'),
      ),
    ).toBe(false);
  });

  it('does not reload again inside the guard window', () => {
    sessionStorage.setItem(STORAGE_KEY, '1000');

    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 5_000),
    ).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(shouldDropRecoveredHardNavigation({}, hardNavigationError())).toBe(
      false,
    );
  });

  it('reloads again after the guard window', () => {
    sessionStorage.setItem(STORAGE_KEY, '1000');

    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 12_000),
    ).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads when the stored timestamp is not a number', () => {
    sessionStorage.setItem(STORAGE_KEY, 'not-a-time');

    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 5_000),
    ).toBe(true);
  });

  it('reloads when session storage cannot be read', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 5_000),
    ).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads when session storage cannot be written', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(
      recoverSameUrlHardNavigation(hardNavigationError(), reload, 5_000),
    ).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('marks the rejection handled when it reloads', () => {
    const preventDefault = jest.fn();

    onSameUrlHardNavigationRejection({
      reason: hardNavigationError(),
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('leaves other rejections unhandled', () => {
    const preventDefault = jest.fn();

    onSameUrlHardNavigationRejection({
      reason: new Error('other'),
      preventDefault,
    });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('installs a single listener', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener');

    installSameUrlHardNavigationRecovery();
    installSameUrlHardNavigationRecovery();

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      'unhandledrejection',
      onSameUrlHardNavigationRejection,
    );
  });

  it('drops the recovered event and still sanitises everything else', () => {
    expect(clientOptions?.beforeSend).toEqual(expect.any(Function));

    const other: Event = {
      message: 'other',
      exception: { values: [{ value: 'other' }] },
    };
    expect(
      clientOptions?.beforeSend?.(other, {
        originalException: new Error('other'),
      }),
    ).toEqual(sanitiseSentryEvent(other));

    recoverSameUrlHardNavigation(hardNavigationError(), reload, 1_000);
    const recovered: Event = {
      exception: {
        values: [{ value: hardNavigationError().message }],
      },
    };
    expect(
      clientOptions?.beforeSend?.(recovered, {
        originalException: new Error('other'),
      }),
    ).toBeNull();
    expect(
      clientOptions?.beforeSend?.(recovered, {
        originalException: hardNavigationError(),
      }),
    ).toBeNull();
  });

  it('does not drop the event when the value is a different error', () => {
    recoverSameUrlHardNavigation(hardNavigationError(), reload, 1_000);

    expect(
      shouldDropRecoveredHardNavigation(
        { exception: { values: [{ value: 'other' }] } },
        new Error('other'),
      ),
    ).toBe(false);
    expect(
      shouldDropRecoveredHardNavigation({ exception: { values: [{}] } }, null),
    ).toBe(false);
    expect(shouldDropRecoveredHardNavigation({}, new Error('other'))).toBe(
      false,
    );
  });
});
