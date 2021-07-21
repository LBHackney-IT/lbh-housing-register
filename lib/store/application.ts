import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Middleware,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { Store } from '.';
import { Application } from '../../domain/HousingApi';
import applicant from './applicant';
import { signOut } from './cognitoUser';
import otherMembers from './otherMembers';

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

const slice = createSlice({
  name: 'application',
  initialState: {} as Application,
  reducers: {
    submit: () => { },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => action.payload)
      .addCase(createApplication.fulfilled, (state, action) => action.payload)
      .addCase(signOut.fulfilled, (state, action) => ({}))
      .addDefaultCase((state, action) => {
        state.mainApplicant = applicant.reducer(state.mainApplicant, action);
        state.otherMembers = otherMembers.reducer(state.otherMembers, action);
      });
  },
});

export const selectApplicant =
  (applicantPersonId: string) => (store: Store) => {
    if (store.application.mainApplicant?.person?.id === applicantPersonId) {
      return store.application.mainApplicant;
    }
    return store.application.otherMembers?.find(
      (a) => a.person?.id === applicantPersonId
    );
  };

export const autoSaveMiddleware: Middleware<
  {},
  Store,
  ThunkDispatch<Store, null, AnyAction>
> = (storeAPI) => (next) => (action) => {
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
    storeAPI.dispatch(updateApplication(newApplication));
  }

  return newAction;
};

export default slice;
