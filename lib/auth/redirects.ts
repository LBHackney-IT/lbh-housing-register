const defaultStaffDestination = '/applications';

export function safeStaffReturnPath(value: unknown): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== 'string') return defaultStaffDestination;

  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\') ||
    candidate.includes('\0')
  ) {
    return defaultStaffDestination;
  }

  try {
    const url = new URL(candidate, 'https://staff-return.invalid');
    if (url.origin !== 'https://staff-return.invalid') {
      return defaultStaffDestination;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return defaultStaffDestination;
  }
}
