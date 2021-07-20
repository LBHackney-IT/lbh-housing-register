import { createAsyncThunk } from '@reduxjs/toolkit';
import { Store } from '.';
import { loadApplication } from './application';
import { loadUser } from './cognitoUser';

export const initStore = createAsyncThunk(
  'init',
  async (_, { dispatch, getState }) => {
    // https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator
    await dispatch(loadUser());
    const store: Store = getState() as Store;
    if (store.cognitoUser?.attributes['custom:application_id']) {
      dispatch(
        loadApplication(store.cognitoUser?.attributes['custom:application_id'])
      );
    }
  }
);
