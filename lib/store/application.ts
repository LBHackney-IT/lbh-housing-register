import throttle from 'lodash.throttle';
import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Middleware,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { Store } from '.';
import { Application } from '../../domain/HousingApi';
import { signOut } from './cognitoUser';
import mainApplicant from './mainApplicant';
import otherMembers from './otherMembers';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';

export const loadApplication = createAsyncThunk(
  'application/load',
  async (id: string) => {
    const r = await fetch(`/api/applications/${id}`);
    return (await r.json()) as Application;
  }
);

export const createApplication = createAsyncThunk(
  'application/create',
  async (application: Application) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });
    return (await res.json()) as Application;
  }
);

export const updateApplication = createAsyncThunk(
  'application/update',
  async (application: Application) => {
    const res = await fetch(`/api/applications/${application.id}`, {
      method: 'PATCH',
      body: JSON.stringify(application),
    });
    return (await res.json()) as Application;
  }
);

export const completeApplication = createAsyncThunk(
  'application/complete',
  async (application: Application) => {
    const res = await fetch(`/api/applications/${application.id}/complete`, {
      method: 'PATCH',
    });
    return (await res.json()) as Application;
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

const slice = createSlice({
  name: 'application',
  initialState: {} as Application,
  reducers: {
    submit: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => action.payload)
      .addCase(createApplication.fulfilled, (state, action) => action.payload)
      .addCase(updateApplication.fulfilled, (state, action) => action.payload)
      //.addCase(completeApplication.fulfilled, (state, action) => action.payload)
      .addCase(signOut.fulfilled, (state, action) => ({}))
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
  {},
  Store,
  ThunkDispatch<Store, null, AnyAction>
> = (storeAPI) => {
  // TODO This basic throttle batches up sequential changes in the store.
  // it doesn't deal with race conditions in communicating with the API.
  // for that we'd also need to cancel existing fetch requests before issuing new ones.

  const throttledDispatch = throttle(
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
        type.startsWith(createApplication.typePrefix) ||
        type.startsWith(updateApplication.typePrefix)
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
