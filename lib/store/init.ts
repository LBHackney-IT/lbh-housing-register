import { createAsyncThunk } from '@reduxjs/toolkit';
import { Store } from '.';
import { loadApplication } from './application';
import { loadUser } from './cognitoUser';

export const initStore = createAsyncThunk(
  'init',
  async (_, { dispatch, getState }) => {
    await dispatch(loadUser());
    // https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator
    const store: Store = getState() as Store;
    if (store.cognitoUser?.attributes['custom:application_id']) {
      await dispatch(
        loadApplication(store.cognitoUser?.attributes['custom:application_id'])
      );
    }
  }
);
