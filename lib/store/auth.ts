import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateAuthRequest,
  CreateAuthResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from '../../domain/HousingApi';
import { Errors } from '../types/errors';
import { fetchWithSentry } from '../utils/sentry';

export const createVerifyCode = createAsyncThunk(
  'auth/create',
  async (emailAddress: string, { rejectWithValue }) => {
    const request: CreateAuthRequest = {
      email: emailAddress,
    };

    const res = await fetchWithSentry(
      '/api/resident-auth/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      },
      {
        operation: 'create_verify_code',
        route: '/api/resident-auth/generate',
      },
    );

    if (res.ok) {
      return (await res.json()) as CreateAuthResponse;
    } else {
      return rejectWithValue(`Unable to create verify code (${res.status})`);
    }
  },
);

export const confirmVerifyCode = createAsyncThunk(
  'auth/confirm',
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue },
  ) => {
    const request: VerifyAuthRequest = {
      email,
      code,
    };
    const res = await fetchWithSentry(
      '/api/resident-auth/verify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      },
      {
        operation: 'confirm_verify_code',
        route: '/api/resident-auth/verify',
      },
    );

    if (res.ok) {
      return (await res.json()) as VerifyAuthResponse;
    }
    if (res.status === 404) {
      return rejectWithValue(Errors.VERIFY_CODE_NOT_CONFIRMED);
    }
    return rejectWithValue(`Unable to confirm verify code (${res.status})`);
  },
);

export const exit = createAsyncThunk('auth/exit', async () => {
  const res = await fetchWithSentry(
    '/api/resident-auth/exit',
    {
      method: 'POST',
    },
    {
      operation: 'resident_sign_out',
      route: '/api/resident-auth/exit',
    },
  );
  return (await res.json()) as VerifyAuthResponse;
});

/* eslint-disable no-empty-pattern */
const slice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exit.fulfilled, () => null);
  },
});

export const {} = slice.actions;
export default slice;
