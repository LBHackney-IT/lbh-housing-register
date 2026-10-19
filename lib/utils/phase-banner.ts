const PHASE_BANNER_ENVIRONMENTS = new Set([
  'development',
  'localdev',
  'staging',
]);

export const hasPhaseBanner = (): boolean => {
  const environment = process.env.NEXT_PUBLIC_ENV?.trim();
  return (
    environment !== undefined && PHASE_BANNER_ENVIRONMENTS.has(environment)
  );
};
