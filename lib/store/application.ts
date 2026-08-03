import throttle from 'lodash/throttle';
import type { AnyAction, Middleware, ThunkDispatch } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Store } from '.';
import {
  Application,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
} from '../../domain/HousingApi';
import { exit } from './auth';
import mainApplicant from './mainApplicant';
import otherMembers from './otherMembers';
import { getRequiredDocumentsForApplication } from '../utils/evidence';
import { ApplicationStatus } from '../types/application-status';

export const loadApplication = createAsyncThunk(
  'application/load',
  async (_: void, { rejectWithValue }) => {
    const res = await fetch(`/api/applications`);

    if (res.ok) {
      const application = (await res.json()) as Application;
      return application.id ? application : null;
    } else {
      return rejectWithValue(`Unable to load application (${res.status})`);
    }
  },
);

export const updateApplication = createAsyncThunk(
  'application/update',
  async (application: Application, { rejectWithValue }) => {
    const res = await fetch(`/api/applications/${application.id}`, {
      method: 'PATCH',
      body: JSON.stringify(application),
    });

    if (res.ok) {
      return (await res.json()) as Application;
    } else {
      return rejectWithValue(`Unable to update application (${res.status})`);
    }
  },
);

export const disqualifyApplication = createAsyncThunk(
  'application/disqualify',
  async (id: string, { rejectWithValue }) => {
    const request: Application = {
      id: id,
      status: ApplicationStatus.DISQUALIFIED,
    };
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
    if (res.ok) {
      return (await res.json()) as EvidenceRequestResponse;
    } else {
      return rejectWithValue(`Unable to complete application (${res.status})`);
    }
  },
);

export const completeApplication = createAsyncThunk<
  void,
  Application,
  { rejectValue: string }
>(
  'application/complete',
  async (application: Application, { rejectWithValue }) => {
    const res = await fetch(`/api/applications/${application.id}/complete`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      return rejectWithValue(`Unable to complete application (${res.status})`);
    }
  },
);

export const createEvidenceRequest = createAsyncThunk(
  'application/evidence',
  async (application: Application, { rejectWithValue }) => {
    if (!application.mainApplicant) {
      return rejectWithValue(
        'Unable to create evidence request: no main applicant',
      );
    }
    const request: CreateEvidenceRequest = {
      documentTypes: getRequiredDocumentsForApplication(
        application.mainApplicant,
      ),
    };
    const res = await fetch(`/api/applications/${application.id}/evidence`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (res.ok) {
      return (await res.json()) as EvidenceRequestResponse;
    } else {
      return rejectWithValue(`Unable to complete application (${res.status})`);
    }
  },
);

// The server derives the NotifyRequest (email address, reference,
// personalisation) entirely from the caller's own stored application record
// - see pages/api/notify/[template].tsx - so these thunks don't send a body.
export const sendConfirmation = createAsyncThunk(
  'application/confirmation',
  async (_: void, { rejectWithValue }) => {
    const res = await fetch(`/api/notify/new-application`, {
      method: 'POST',
    });

    if (!res.ok) {
      const message = `Unable to send confirmation email (${res.status})`;
      console.error(message);
      return rejectWithValue(message);
    }
  },
);

export const sendMedicalNeed = createAsyncThunk(
  'application/medical',
  async (_: void, { rejectWithValue }) => {
    const res = await fetch(`/api/notify/medical`, {
      method: 'POST',
    });

    if (!res.ok) {
      const message = `Unable to send medical need email (${res.status})`;
      console.error(message);
      return rejectWithValue(message);
    }
  },
);

// Must not share `disqualifyApplication`'s type prefix: these are different
// actions, and that case replaces the whole application state with its payload.
export const sendDisqualifyEmail = createAsyncThunk(
  'application/disqualifyEmail',
  async (_: void, { rejectWithValue }) => {
    const res = await fetch(`/api/notify/disqualify`, {
      method: 'POST',
    });

    if (!res.ok) {
      const message = `Unable to send disqualify email (${res.status})`;
      console.error(message);
      return rejectWithValue(message);
    }
  },
);

const slice = createSlice({
  name: 'application',
  initialState: {} as Application,
  reducers: {
    submit: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadApplication.fulfilled,
        (state, action) => action.payload ?? {},
      )
      .addCase(updateApplication.fulfilled, (state, action) => action.payload)
      .addCase(
        disqualifyApplication.fulfilled,
        (state, action) => action.payload,
      )
      .addCase(completeApplication.fulfilled, (state, action) => action.payload)
      .addCase(exit.fulfilled, (state, action) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

      .addDefaultCase((state, action) => {
        state.mainApplicant = mainApplicant.reducer(
          state.mainApplicant,
          action,
        );
        state.otherMembers = otherMembers.reducer(state.otherMembers, action);
      });
  },
});

export const autoSaveMiddleware: Middleware<
  Record<string, never>,
  Store,
  ThunkDispatch<Store, null, AnyAction>
> = (storeAPI) => {
  // TODO This basic throttle batches up sequential changes in the store.
  // it doesn't deal with race conditions in communicating with the API.
  // for that we'd also need to cancel existing fetch requests before issuing new ones.

  const throttledDispatch = throttle(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any) => {
      storeAPI.dispatch(action);
    },
    100,
    {
      leading: false,
    },
  );
  return (next) => (action: unknown) => {
    const previousApplication = storeAPI.getState().application;
    const newAction = next(action);
    const newApplication = storeAPI.getState().application;
    const typedAction = action as AnyAction;
    function blacklist(type: string) {
      return (
        type.startsWith(loadApplication.typePrefix) ||
        type.startsWith(updateApplication.typePrefix) ||
        type.startsWith(disqualifyApplication.typePrefix)
      );
    }

    if (
      previousApplication !== newApplication &&
      newApplication.id &&
      !blacklist(typedAction.type)
    ) {
      throttledDispatch(updateApplication(newApplication));
    }

    return newAction;
  };
};

export default slice;
