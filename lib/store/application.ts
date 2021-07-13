import {
    createAsyncThunk,
    createSlice
} from '@reduxjs/toolkit';
import { Store } from '.';
import { Application } from '../../domain/HousingApi';
import applicant from './applicant';
import otherMembers from './otherMembers';


export const loadApplicaiton = createAsyncThunk(
  'application/load',
  async (id?: string) => {
    if (!id) {
      return Promise.reject();
    }
    const r = await fetch(`/api/applications/${id}`);
    return (await r.json()) as Application;
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
    submit: () => {},
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadApplicaiton.fulfilled,
      (state, action) => action.payload
    );
    builder.addDefaultCase((state, action) => {
      state.mainApplicant = applicant.reducer(state.mainApplicant, action);
      state.otherMembers = otherMembers.reducer(state.otherMembers, action);
    });
  },
});

// export const selectAllApplicants = () => (store: Store) =>
//   [store.application.mainApplicant, ...(store.application.otherMembers || [])];

export const selectApplicant =
  (applicantPersonId: string) => (store: Store) => {
    if (store.application.mainApplicant?.person?.id === applicantPersonId) {
      return store.application.mainApplicant;
    }
    return store.application.otherMembers?.find(
      (a) => a.person?.id === applicantPersonId
    );
  };

export default slice;
