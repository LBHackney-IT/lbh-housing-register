import { configureStore } from '@reduxjs/toolkit';

import { Application } from '../../domain/HousingApi';
import { ApplicationStatus } from '../types/application-status';
import application, {
  applicationSubmitted,
  autoSaveMiddleware,
  completeApplication,
  updateApplication,
} from './application';
import applicationLoad from './application-load';
import { hrApiCallsStatus } from './apiCallsStatus';
import { updateBeforeFirstSave } from './mainApplicant';

function makeStore(preloadedApplication: Application = {}) {
  return configureStore({
    reducer: {
      application: application.reducer,
      applicationLoad: applicationLoad.reducer,
      hrApiCallsStatus: hrApiCallsStatus.reducer,
    },
    preloadedState: { application: preloadedApplication },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(autoSaveMiddleware),
  });
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

const staleApplication: Application = {
  id: 'app-1',
  reference: 'ref-1',
  status: ApplicationStatus.CANCELLED,
  assignedTo: 'officer@hackney.gov.uk',
  sensitiveData: true,
  submittedAt: '2026-11-11T16:23:00Z',
  assessment: { reason: 'other', band: 'A', bedroomNeed: 2 },
  mainApplicant: { person: { firstName: 'Pat', surname: 'Parkinson' } },
  otherMembers: [{ person: { firstName: 'Sam', surname: 'Parkinson' } }],
};

describe('application store', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  describe('updateApplication', () => {
    it('sends only the household details, never status or assessment', async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, staleApplication));
      const store = makeStore(staleApplication);

      await store.dispatch(updateApplication(staleApplication));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/applications/app-1');
      expect(init.method).toBe('PATCH');
      expect(JSON.parse(init.body)).toEqual({
        id: 'app-1',
        mainApplicant: staleApplication.mainApplicant,
        otherMembers: staleApplication.otherMembers,
      });
    });

    it('sends only the details a resident enters for each person', async () => {
      const staffOwned = {
        medicalNeed: { outcome: 'approved' },
        requiresMedical: true,
        evidence: [],
      };
      const resident = {
        person: { id: 'p-1', firstName: 'Pat' },
        address: { postcode: 'E8 1AA' },
        contactInformation: { emailAddress: 'pat@example.test' },
        questions: [{ id: 'q1', answer: 'yes' }],
      };
      const application = {
        id: 'app-1',
        mainApplicant: { ...resident, ...staffOwned },
        otherMembers: [{ ...resident, ...staffOwned }],
      } as Application;
      fetchMock.mockResolvedValue(jsonResponse(200, application));
      const store = makeStore(application);

      await store.dispatch(updateApplication(application));

      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        id: 'app-1',
        mainApplicant: resident,
        otherMembers: [resident],
      });
    });

    it('omits household fields that are not in the store', async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, { id: 'app-1' }));
      const store = makeStore({ id: 'app-1', status: 'Cancelled' });

      await store.dispatch(
        updateApplication({ id: 'app-1', status: 'Cancelled' }),
      );

      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        id: 'app-1',
      });
    });
  });

  describe('completeApplication', () => {
    it('resolves with the submitted application from the response', async () => {
      const submitted = {
        ...staleApplication,
        status: ApplicationStatus.SUBMITTED,
        submittedAt: '2026-11-18T19:10:00Z',
      };
      fetchMock.mockResolvedValue(jsonResponse(200, submitted));
      const store = makeStore(staleApplication);

      const result = await store
        .dispatch(completeApplication(staleApplication))
        .unwrap();

      expect(fetchMock.mock.calls[0][0]).toBe(
        '/api/applications/app-1/complete',
      );
      expect(result).toEqual(submitted);
    });

    it('rejects when a successful response has no application in it', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected end of JSON input');
        },
      });
      const store = makeStore(staleApplication);

      await expect(
        store.dispatch(completeApplication(staleApplication)).unwrap(),
      ).rejects.toBe('Unexpected response when completing application');
    });

    it('rejects with the status code when completing fails', async () => {
      fetchMock.mockResolvedValue(jsonResponse(500, { message: 'nope' }));
      const store = makeStore(staleApplication);

      await expect(
        store.dispatch(completeApplication(staleApplication)).unwrap(),
      ).rejects.toBe('Unable to complete application (500)');
    });

    it('leaves the store alone until applicationSubmitted is dispatched', async () => {
      const submitted = {
        ...staleApplication,
        status: ApplicationStatus.SUBMITTED,
      };
      fetchMock.mockResolvedValue(jsonResponse(200, submitted));
      const store = makeStore(staleApplication);

      const result = await store
        .dispatch(completeApplication(staleApplication))
        .unwrap();

      expect(store.getState().application.status).toBe(
        ApplicationStatus.CANCELLED,
      );

      store.dispatch(applicationSubmitted(result));

      expect(store.getState().application).toEqual(submitted);
    });
  });

  describe('autosave', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('saves when the household details change', async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, staleApplication));
      const store = makeStore(staleApplication);

      store.dispatch(
        updateBeforeFirstSave({ person: { firstName: 'Patricia' } }),
      );
      await jest.advanceTimersByTimeAsync(500);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][1].method).toBe('PATCH');
    });

    it('does not save when the submitted application replaces the store', async () => {
      const store = makeStore(staleApplication);

      store.dispatch(
        applicationSubmitted({
          ...staleApplication,
          status: ApplicationStatus.SUBMITTED,
        }),
      );
      await jest.advanceTimersByTimeAsync(500);

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
