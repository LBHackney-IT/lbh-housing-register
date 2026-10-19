import { hasPhaseBanner } from './phase-banner';

describe('hasPhaseBanner', () => {
  const originalEnvironment = process.env;

  afterEach(() => {
    process.env = originalEnvironment;
  });

  function withPublicEnv(publicEnv?: string) {
    process.env = { ...originalEnvironment };
    if (publicEnv === undefined) {
      delete process.env.NEXT_PUBLIC_ENV;
    } else {
      process.env.NEXT_PUBLIC_ENV = publicEnv;
    }
  }

  it.each(['development', 'staging', 'localdev'])(
    'shows the banner for %s',
    (stage) => {
      withPublicEnv(stage);

      expect(hasPhaseBanner()).toBe(true);
    },
  );

  it.each(['production', 'ci', ''])('hides the banner for %s', (stage) => {
    withPublicEnv(stage);

    expect(hasPhaseBanner()).toBe(false);
  });

  it('hides the banner when the stage is unset', () => {
    withPublicEnv();

    expect(hasPhaseBanner()).toBe(false);
  });

  it('ignores surrounding whitespace', () => {
    withPublicEnv('  staging  ');

    expect(hasPhaseBanner()).toBe(true);
  });
});
