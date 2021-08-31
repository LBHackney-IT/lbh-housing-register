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
    return await res.json();
  }
);

export const completeApplication = createAsyncThunk(
  'application/complete',
  async (application: Application) => {
    // Only returns the json error rather than status code one
    const res = await fetch(`/api/application/${application.id}/complete`, {
      method: 'PATCH',
    });
    // .then((response) => {
    //   if (response.status >= 400 && response.status < 600) {
    //     console.log('something went wrong', response);
    //     throw new Error(`Request failed with status code ${response.status}`);
    //   }
    //   return response;
    // })
    // .catch((e) => {
    //   console.log('was ist hier los', e);
    //   return e;
    // });
    console.log('res is', res);
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
        ref_number: application.id ?? '',
        resident_name: application.mainApplicant?.person?.firstName ?? '',
      },
      reference: `${application.id}`,
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
      .addCase(signOut.fulfilled, (state, action) => ({}))
      .addCase(completeApplication.rejected, (state, action) => {
        // Is this required or a necessity, can we not handle it directly in the function?
        console.log('what is action', action);
      })

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
        type.startsWith(createApplication.typePrefix)
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
