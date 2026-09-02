import { Application } from '../../domain/HousingApi';
import {
  CreateApplicationError,
  addNoteToHistory,
  createApplication,
  updateApplication,
} from './internal-api';

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
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
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
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('updateApplication', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the updated application when the request succeeds', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: async () => application,
    });

    await expect(updateApplication(application)).resolves.toEqual(application);
  });

  it('throws the API message when the request fails', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => ({
        message: 'Supplied bidding number "1234567" is reserved',
        type: 'InvalidBiddingNumberException',
      }),
    });

    await expect(updateApplication(application)).rejects.toThrow(
      'Supplied bidding number "1234567" is reserved',
    );
  });

  it('falls back to a status message when the body has no message', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => application,
    });

    await expect(updateApplication(application)).rejects.toThrow(
      'Unable to update application (400)',
    );
  });
});

describe('addNoteToHistory', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the response body when the request succeeds', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: async () => [{ Note: 'hello' }],
    });

    await expect(addNoteToHistory('app-1', { Note: 'hello' })).resolves.toEqual(
      [{ Note: 'hello' }],
    );
  });

  it('throws the API message when the request fails', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Unable to add note to activity history' }),
    });

    await expect(addNoteToHistory('app-1', { Note: 'hello' })).rejects.toThrow(
      'Unable to add note to activity history',
    );
  });
});
