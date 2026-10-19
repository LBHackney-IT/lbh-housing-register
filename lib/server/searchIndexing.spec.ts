import { isSearchEngineIndexable, robotsTxt } from './searchIndexing';

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
    expect(robotsTxt()).toBe('User-agent: *\nAllow: /\n');
  });

  it('uses the build-time stage when the Lambda stage is unset', () => {
    withStage(undefined, 'production');

    expect(isSearchEngineIndexable()).toBe(true);
  });

  it.each(['development', 'staging', 'ci', 'localdev'])(
    'blocks %s',
    (stage) => {
      withStage(stage, 'production');

      expect(isSearchEngineIndexable()).toBe(false);
      expect(robotsTxt()).toBe('User-agent: *\nDisallow: /\n');
    },
  );

  it('fails closed when no stage is set', () => {
    withStage();

    expect(isSearchEngineIndexable()).toBe(false);
    expect(robotsTxt()).toBe('User-agent: *\nDisallow: /\n');
  });

  it('ignores a blank Lambda stage and uses the build-time stage', () => {
    withStage('  ', 'production');

    expect(isSearchEngineIndexable()).toBe(true);
  });
});
