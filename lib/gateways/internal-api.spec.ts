import { Application } from '../../domain/HousingApi';
import { CreateApplicationError, createApplication } from './internal-api';

const application = { id: 'app-1' } as Application;

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn().mockResolvedValue(response);
};

describe('createApplication', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the created application when the request succeeds', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: async () => application,
    });

    await expect(createApplication(application)).resolves.toEqual(application);
  });

  it.each([
    {
      applicationIds: ['id-1'],
      message: 'An application already exists for this email address.',
    },
    {
      applicationIds: ['id-1', 'id-2'],
      message: 'Applications already exist for this email address.',
    },
    {
      applicationIds: [],
      message: 'An application already exists for this email address.',
    },
  ])(
    'throws a 409 CreateApplicationError when applicationIds is $applicationIds',
    async ({ applicationIds, message }) => {
      mockFetch({
        ok: false,
        status: 409,
        json: async () => ({ applicationIds }),
      });

      await expect(createApplication(application)).rejects.toMatchObject({
        name: 'CreateApplicationError',
        status: 409,
        applicationIds,
        message,
      });
    },
  );

  it('throws CreateApplicationError with the API message for other failures', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Downstream failed' }),
    });

    const error = await createApplication(application).catch((err) => err);

    expect(error).toBeInstanceOf(CreateApplicationError);
    expect(error).toMatchObject({
      status: 500,
      applicationIds: [],
      message: 'Downstream failed',
    });
  });

  it('falls back to a status message when the error body is not JSON', async () => {
    mockFetch({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('invalid json');
      },
    });

    await expect(createApplication(application)).rejects.toMatchObject({
      status: 502,
      message: 'Unable to create application (502)',
    });
  });
});
