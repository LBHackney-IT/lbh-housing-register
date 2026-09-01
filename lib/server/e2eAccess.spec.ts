import { areE2eRoutesEnabled, areE2eStaffGroupsEnabled } from './e2eAccess';

describe('areE2eRoutesEnabled', () => {
  const originalEnvironment = process.env;

  beforeEach(() => {
    process.env = { ...originalEnvironment, E2E_HTTP_MOCKS: 'true' };
    delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    delete process.env.SENTRY_ENVIRONMENT;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('permits local and CI E2E processes', () => {
    expect(areE2eRoutesEnabled()).toBe(true);
  });

  it('fails closed in AWS Lambda even when the flag is set', () => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = 'deployed-function';
    expect(areE2eRoutesEnabled()).toBe(false);
  });

  it('fails closed in named deployment environments', () => {
    process.env.SENTRY_ENVIRONMENT = 'development';
    expect(areE2eRoutesEnabled()).toBe(false);
  });
});

describe('areE2eStaffGroupsEnabled', () => {
  const originalEnvironment = process.env;

  beforeEach(() => {
    process.env = { ...originalEnvironment, LOCAL_E2E: 'true' };
    delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    delete process.env.SENTRY_ENVIRONMENT;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('permits local E2E processes', () => {
    expect(areE2eStaffGroupsEnabled()).toBe(true);
  });

  it('stays disabled without the local E2E flag', () => {
    delete process.env.LOCAL_E2E;
    expect(areE2eStaffGroupsEnabled()).toBe(false);
  });

  it('is not implied by the mocked E2E flag', () => {
    delete process.env.LOCAL_E2E;
    process.env.E2E_HTTP_MOCKS = 'true';
    expect(areE2eStaffGroupsEnabled()).toBe(false);
  });

  it('fails closed in AWS Lambda even when the flag is set', () => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = 'deployed-function';
    expect(areE2eStaffGroupsEnabled()).toBe(false);
  });

  it('fails closed in named deployment environments', () => {
    process.env.SENTRY_ENVIRONMENT = 'production';
    expect(areE2eStaffGroupsEnabled()).toBe(false);
  });
});
