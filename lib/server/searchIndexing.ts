function stageValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function isSearchEngineIndexable(): boolean {
  const stage =
    stageValue(process.env.SENTRY_ENVIRONMENT) ||
    stageValue(process.env.NEXT_PUBLIC_ENV);

  return stage === 'production';
}

export function robotsTxt(): string {
  if (isSearchEngineIndexable()) {
    return 'User-agent: *\nAllow: /\n';
  }

  return 'User-agent: *\nDisallow: /\n';
}
