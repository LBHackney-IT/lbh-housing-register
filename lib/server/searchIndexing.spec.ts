import {
  isSearchEngineIndexable,
  robotsMetaContent,
  robotsTxt,
} from './searchIndexing';

describe('isSearchEngineIndexable', () => {
  const originalEnvironment = process.env;

  afterEach(() => {
    process.env = originalEnvironment;
  });

  function withStage(sentry?: string, publicEnv?: string) {
    process.env = { ...originalEnvironment };
    if (sentry === undefined) {
      delete process.env.SENTRY_ENVIRONMENT;
    } else {
      process.env.SENTRY_ENVIRONMENT = sentry;
    }
    if (publicEnv === undefined) {
      delete process.env.NEXT_PUBLIC_ENV;
    } else {
      process.env.NEXT_PUBLIC_ENV = publicEnv;
    }
  }

  it('indexes only a production deployment', () => {
    withStage('production', 'staging');

    expect(isSearchEngineIndexable()).toBe(true);
    expect(robotsMetaContent()).toBeUndefined();
    expect(robotsTxt()).toBe('User-agent: *\nAllow: /\n');
  });

  it('uses the build-time stage when the Lambda stage is unset', () => {
    withStage(undefined, 'production');

    expect(isSearchEngineIndexable()).toBe(true);
    expect(robotsMetaContent()).toBeUndefined();
  });

  it.each(['development', 'staging', 'ci', 'localdev'])(
    'keeps %s crawlable and noindex',
    (stage) => {
      withStage(stage, 'production');

      expect(isSearchEngineIndexable()).toBe(false);
      expect(robotsMetaContent()).toBe('noindex');
      expect(robotsTxt()).toBe('User-agent: *\nAllow: /\n');
    },
  );

  it('fails closed when no stage is set', () => {
    withStage();

    expect(isSearchEngineIndexable()).toBe(false);
    expect(robotsMetaContent()).toBe('noindex');
    expect(robotsTxt()).toBe('User-agent: *\nAllow: /\n');
  });

  it('ignores a blank Lambda stage and uses the build-time stage', () => {
    withStage('  ', 'production');

    expect(isSearchEngineIndexable()).toBe(true);
  });
});
