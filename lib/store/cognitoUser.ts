import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Amplify, { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

export interface CognitoUserInfo {
  username: string;
  attributes: {
    sub: string;
    email_verified: boolean;
    phone_number_verified: boolean;
    phone_number: string;
    given_name: string;
    family_name: string;
    email: string;
    'custom:application_id': string;
  };
}

export const loadUser = createAsyncThunk('cognitoUser/loadUser', async () => {
  try {
    return (await Auth.currentUserInfo()) as CognitoUserInfo;
  } catch (e) {
    // No op - the user isn't logged in and that's fine.
    return null;
  }
});

const slice = createSlice({
  name: 'user',
  initialState: null as CognitoUserInfo | null,
  reducers: {
    login() {},
    register() {},
    logout() {},
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => action.payload);
  },
});

export const { login, register, logout } = slice.actions;
export default slice;
