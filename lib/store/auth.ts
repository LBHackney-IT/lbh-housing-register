import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateAuthRequest,
  CreateAuthResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from '../../domain/HousingApi';

export const createVerifyCode = createAsyncThunk(
  'auth/create',
  async (emailAddress: string, { rejectWithValue }) => {
    const request: CreateAuthRequest = {
      email: emailAddress,
    };

    const res = await fetch(`/api/auth/generate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (res.ok) {
      return (await res.json()) as CreateAuthResponse;
    } else {
      return rejectWithValue(`Unable to create verify code (${res.status})`);
    }
  }
);

export const confirmVerifyCode = createAsyncThunk(
  'auth/confirm',
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    const request: VerifyAuthRequest = {
      email,
      code,
    };
    const res = await fetch(`/api/auth/verify`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (res.ok) {
      return (await res.json()) as VerifyAuthResponse;
    } else {
      return rejectWithValue(`Unable to confirm verify code (${res.status})`);
    }
  }
);

export const exit = createAsyncThunk('auth/exit', async () => {
  const res = await fetch(`/api/auth/exit`, {
    method: 'POST',
  });
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
