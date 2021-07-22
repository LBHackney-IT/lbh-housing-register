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
const initialState: Application = { id: '' };
const slice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    submit: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => action.payload)
      .addCase(createApplication.fulfilled, (state, action) => action.payload)
      .addCase(signOut.fulfilled, () => initialState)
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
