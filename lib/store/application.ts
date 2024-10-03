import throttle from 'lodash.throttle';
import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Middleware,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { Store } from '.';
import {
  Application,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
} from '../../domain/HousingApi';
import { exit } from './auth';
import mainApplicant from './mainApplicant';
import otherMembers from './otherMembers';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';
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
  }
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
  }
);

export const disqualifyApplication = createAsyncThunk(
  'application/disqualify',
  async (id: string) => {
    const request: Application = {
      id: id,
      status: ApplicationStatus.DISQUALIFIED,
    };
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }
);

export const completeApplication = createAsyncThunk(
  'application/complete',
  async (application: Application) => {
    await fetch(`/api/applications/${application.id}/complete`, {
      method: 'PATCH',
    });
  }
);

export const createEvidenceRequest = createAsyncThunk(
  'application/evidence',
  async (application: Application) => {
    const request: CreateEvidenceRequest = {
      documentTypes: getRequiredDocumentsForApplication(
        application.mainApplicant!
      ),
    };
    const res = await fetch(`/api/applications/${application.id}/evidence`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return (await res.json()) as EvidenceRequestResponse;
  }
);

export const sendConfirmation = createAsyncThunk(
  'application/confirmation',
  async (application: Application) => {
    const notifyRequest: NotifyRequest = {
      emailAddress:
        application.mainApplicant?.contactInformation?.emailAddress ?? '',
      personalisation: {
        ref_number: application.reference ?? '',
        resident_name: application.mainApplicant?.person?.firstName ?? '',
      },
      reference: `${application.reference}`,
    };

    const res = await fetch(`/api/notify/new-application`, {
      method: 'POST',
      body: JSON.stringify(notifyRequest),
    });

    return (await res.json()) as NotifyResponse;
  }
);

export const sendMedicalNeed = createAsyncThunk(
  'application/medical',
  async ({
    application,
    medicalNeeds,
  }: {
    application: Application;
    medicalNeeds: number;
  }) => {
    const notifyRequest: NotifyRequest = {
      emailAddress:
        application.mainApplicant?.contactInformation?.emailAddress ?? '',
      personalisation: {
        household_members_with_medical_need: medicalNeeds.toString(),
        resident_name: application.mainApplicant?.person?.firstName ?? '',
      },
      reference: `${application.reference}`,
    };

    const res = await fetch(`/api/notify/medical`, {
      method: 'POST',
      body: JSON.stringify(notifyRequest),
    });

    return (await res.json()) as NotifyResponse;
  }
);

export const sendDisqualifyEmail = createAsyncThunk(
  'application/disqualify',
  async ({
    application,
    reason,
  }: {
    application: Application;
    reason: string;
  }) => {
    const notifyRequest: NotifyRequest = {
      emailAddress:
        application.mainApplicant?.contactInformation?.emailAddress ?? '',
      personalisation: {
        ref_number: application.reference ?? '',
        resident_name: application.mainApplicant?.person?.firstName ?? '',
        reason: reason,
      },
      reference: `${application.reference}`,
    };

    const res = await fetch(`/api/notify/disqualify`, {
      method: 'POST',
      body: JSON.stringify(notifyRequest),
    });

    return (await res.json()) as NotifyResponse;
  }
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
        (state, action) => action.payload ?? {}
      )
      .addCase(updateApplication.fulfilled, (state, action) => action.payload)
      .addCase(
        disqualifyApplication.fulfilled,
        (state, action) => action.payload
      )
      .addCase(completeApplication.fulfilled, (state, action) => action.payload)
      .addCase(exit.fulfilled, (state, action) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

      .addDefaultCase((state, action) => {
        state.mainApplicant = mainApplicant.reducer(
          state.mainApplicant,
          action
        );
        state.otherMembers = otherMembers.reducer(state.otherMembers, action);
      });
  },
});

export const autoSaveMiddleware: Middleware<
  {}, // eslint-disable-line @typescript-eslint/ban-types
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
    }
  );
  return (next) => (action) => {
    const previousApplication = storeAPI.getState().application;
    const newAction = next(action);
    const newApplication = storeAPI.getState().application;
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
      !blacklist(action.type)
    ) {
      throttledDispatch(updateApplication(newApplication));
    }

    return newAction;
  };
};

export default slice;
