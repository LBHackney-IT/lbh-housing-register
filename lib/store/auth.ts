import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateAuthRequest,
  CreateAuthResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from '../../domain/HousingApi';

export const createVerifyCode = createAsyncThunk(
  'auth/create',
  async (emailAddress: string) => {
    const request: CreateAuthRequest = {
      email: emailAddress,
    };

    const res = await fetch(`/api/auth/generate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return (await res.json()) as CreateAuthResponse;
  }
);

export const confirmVerifyCode = createAsyncThunk(
  'auth/confirm',
  async ({ email, code }: { email: string; code: string }) => {
    const request: VerifyAuthRequest = {
      email,
      code,
    };
    const res = await fetch(`/api/auth/verify`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return (await res.json()) as VerifyAuthResponse;
  }
);

export const exit = createAsyncThunk('auth/exit', async () => {
  const res = await fetch(`/api/auth/exit`, {
    method: 'POST',
  });
  return (await res.json()) as VerifyAuthResponse;
});

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
