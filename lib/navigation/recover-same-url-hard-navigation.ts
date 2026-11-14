// Next.js client navigations request /_next/data/{buildId}/…. After a deploy
// that build id 404s. The router then tries a full page load, and throws this
// invariant when the target is the URL already open, so the tab never picks
// up the new build. One reload does that load. A second failure inside the
// window is left unhandled so a real loop is still reported.

export const SAME_URL_HARD_NAVIGATION_PREFIX =
  'Invariant: attempted to hard navigate to the same URL';

const STORAGE_KEY = 'housing-register:same-url-hard-navigation';
const RELOAD_WINDOW_MS = 10_000;
const INSTALLED_FLAG = '__housingRegisterSameUrlHardNavigationInstalled';
const RECOVERED_FLAG = '__housingRegisterSameUrlHardNavigationRecovered';

type RecoveryWindow = Window & {
  [INSTALLED_FLAG]?: boolean;
  [RECOVERED_FLAG]?: boolean;
};

const recoveryWindow = (): RecoveryWindow => window as RecoveryWindow;

export const sameUrlHardNavigation = {
  reloadDocument(): void {
    window.location.reload();
  },
};

export function isSameUrlHardNavigationError(reason: unknown): boolean {
  if (typeof reason !== 'object' || reason === null || !('message' in reason)) {
    return false;
  }

  const { message } = reason as { message: unknown };
  return (
    typeof message === 'string' &&
    message.startsWith(SAME_URL_HARD_NAVIGATION_PREFIX)
  );
}

const lastReloadAt = (): number | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const at = Number(raw);
    return Number.isFinite(at) ? at : null;
  } catch {
    return null;
  }
};

const rememberReload = (now: number): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(now));
  } catch {
    // Storage can throw in private mode. This attempt still reloads once.
  }
};

export function recoverSameUrlHardNavigation(
  reason: unknown,
  reload: () => void = () => sameUrlHardNavigation.reloadDocument(),
  now: number = Date.now(),
): boolean {
  if (!isSameUrlHardNavigationError(reason)) return false;

  const previous = lastReloadAt();
  if (previous !== null && now - previous < RELOAD_WINDOW_MS) return false;

  recoveryWindow()[RECOVERED_FLAG] = true;
  rememberReload(now);
  reload();
  return true;
}

export function onSameUrlHardNavigationRejection(
  event: Pick<PromiseRejectionEvent, 'reason' | 'preventDefault'>,
): void {
  if (recoverSameUrlHardNavigation(event.reason)) {
    event.preventDefault();
  }
}

export function installSameUrlHardNavigationRecovery(): void {
  if (typeof window === 'undefined') return;

  const target = recoveryWindow();
  if (target[INSTALLED_FLAG]) return;

  target[INSTALLED_FLAG] = true;
  window.addEventListener(
    'unhandledrejection',
    onSameUrlHardNavigationRejection,
  );
}

export function shouldDropRecoveredHardNavigation(
  event: { exception?: { values?: Array<{ value?: string }> } },
  originalException: unknown,
): boolean {
  if (typeof window === 'undefined') return false;
  if (recoveryWindow()[RECOVERED_FLAG] !== true) return false;
  if (isSameUrlHardNavigationError(originalException)) return true;

  const value = event.exception?.values?.[0]?.value;
  return (
    typeof value === 'string' &&
    value.startsWith(SAME_URL_HARD_NAVIGATION_PREFIX)
  );
}
