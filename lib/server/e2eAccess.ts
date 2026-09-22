/**
 * E2E support must never be available from a deployed Lambda, even if a feature
 * flag is accidentally set. CI runs `next start` outside Lambda.
 */
function isOutsideDeployment(): boolean {
  return (
    !process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.SENTRY_ENVIRONMENT
  );
}

/** Mocked E2E routes and the synthetic staff session they rely on. */
export function areE2eRoutesEnabled(): boolean {
  return process.env.E2E_HTTP_MOCKS === 'true' && isOutsideDeployment();
}

/**
 * The dedicated Cypress Cognito user carries its own test group rather than
 * the real ones, so local E2E runs additionally honour
 * E2E_AUTHORISED_MANAGER_GROUP.
 */
export function areE2eStaffGroupsEnabled(): boolean {
  return process.env.LOCAL_E2E === 'true' && isOutsideDeployment();
}
