import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  },
});

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

export const updateUserAttribute = createAsyncThunk(
  'cognitoUser/updateUserAttribute',
  async ({ applicationId }: { applicationId: string }) => {
    const promise = Auth.currentAuthenticatedUser();
    promise.then((user) =>
      Auth.updateUserAttributes(user, {
        'custom:application_id': applicationId,
      })
    );
    return promise;
  }
);

export const signIn = createAsyncThunk(
  'cognitoUser/signIn',
  async (
    { username, password }: { username: string; password: string },
    api
  ) => {
    const promise = Auth.signIn(username, password);
    promise.then(() => api.dispatch(loadUser()));
    return promise;
  }
);

export const signOut = createAsyncThunk('cognitoUser/signOut', async () => {
  return (await Auth.signOut()) as void;
});

const slice = createSlice({
  name: 'user',
  initialState: null as CognitoUserInfo | null,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => action.payload)
      .addCase(signOut.fulfilled, () => null);
  },
});

export const {} = slice.actions;
export default slice;
