import { configureStore } from '@reduxjs/toolkit';

import { exit } from './auth';
import application, { loadApplication } from './application';
import applicationLoad, {
  isUnauthenticatedApplicationLoad,
  selectApplicationLoadStatus,
} from './application-load';
import { hrApiCallsStatus } from './apiCallsStatus';

function makeStore() {
  return configureStore({
    reducer: {
      application: application.reducer,
      applicationLoad: applicationLoad.reducer,
      hrApiCallsStatus: hrApiCallsStatus.reducer,
    },
  });
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('application load status', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('treats 401 and 403 payloads as signed out', () => {
    expect(
      isUnauthenticatedApplicationLoad('Unable to load application (401)'),
    ).toBe(true);
    expect(
      isUnauthenticatedApplicationLoad('Unable to load application (403)'),
    ).toBe(true);
    expect(
      isUnauthenticatedApplicationLoad('Unable to load application (500)'),
    ).toBe(false);
    expect(isUnauthenticatedApplicationLoad(undefined)).toBe(false);
    expect(isUnauthenticatedApplicationLoad({ status: 401 })).toBe(false);
  });

  it('moves from idle to loading, then loaded when the application has an id', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { id: 'app-1', reference: 'ref' }),
    );
    const store = makeStore();

    const pending = store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loading');
    await pending;

    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');
    expect(store.getState().application.id).toBe('app-1');
  });

  it('keeps a loaded application on screen while another load is in flight', async () => {
    let resolveSecond: (value: ReturnType<typeof jsonResponse>) => void = () =>
      undefined;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { id: 'app-1' }))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );

    const store = makeStore();
    await store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');

    const second = store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');

    resolveSecond(jsonResponse(200, { id: 'app-1', reference: 'updated' }));
    await second;
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');
    expect(store.getState().application.reference).toBe('updated');
  });

  it('stays loading when a second request starts before the first finishes', async () => {
    const resolvers: Array<(value: ReturnType<typeof jsonResponse>) => void> =
      [];
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const store = makeStore();

    const first = store.dispatch(loadApplication());
    const second = store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loading');

    resolvers.forEach((resolve) => resolve(jsonResponse(200, { id: 'app-1' })));
    await Promise.all([first, second]);
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');
  });

  it('fails when the response has no application id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { reference: 'no-id' }));
    const store = makeStore();

    await store.dispatch(loadApplication());

    expect(selectApplicationLoadStatus(store.getState())).toBe('failed');
  });

  it.each([401, 403])(
    'marks %s as unauthenticated and does not treat a later load as a fresh failure',
    async (status) => {
      fetchMock.mockResolvedValue(jsonResponse(status, {}));
      const store = makeStore();

      await store.dispatch(loadApplication());
      expect(selectApplicationLoadStatus(store.getState())).toBe(
        'unauthenticated',
      );

      const again = store.dispatch(loadApplication());
      expect(selectApplicationLoadStatus(store.getState())).toBe(
        'unauthenticated',
      );
      await again;
    },
  );

  it('marks a server error as failed and a retry as loading', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, {}));
    const store = makeStore();

    await store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('failed');

    let resolveRetry: (value: ReturnType<typeof jsonResponse>) => void = () =>
      undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRetry = resolve;
        }),
    );
    const retry = store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loading');
    resolveRetry(jsonResponse(200, { id: 'app-1' }));
    await retry;
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');
  });

  it('marks a network failure as failed', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    const store = makeStore();

    await store.dispatch(loadApplication());

    expect(selectApplicationLoadStatus(store.getState())).toBe('failed');
  });

  it('returns to idle after sign out', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'app-1' }));
    const store = makeStore();
    await store.dispatch(loadApplication());
    expect(selectApplicationLoadStatus(store.getState())).toBe('loaded');

    fetchMock.mockResolvedValue(jsonResponse(200, {}));
    await store.dispatch(exit());

    expect(selectApplicationLoadStatus(store.getState())).toBe('idle');
    expect(store.getState().application).toEqual({});
  });
});
