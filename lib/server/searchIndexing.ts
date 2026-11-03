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

export function robotsMetaContent(): 'noindex' | undefined {
  return isSearchEngineIndexable() ? undefined : 'noindex';
}

export function robotsTxt(): string {
  return 'User-agent: *\nAllow: /\n';
}
