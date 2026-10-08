import { createSlice } from '@reduxjs/toolkit';

import { exit } from './auth';
import { loadApplication } from './application';

export type ApplicationLoadStatus =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'unauthenticated'
  | 'failed';

export interface ApplicationLoadState {
  status: ApplicationLoadStatus;
}

const initialState: ApplicationLoadState = {
  status: 'idle',
};

/**
 * 401 and 403 from GET /api/applications mean the resident session cannot
 * load an application. The rejected payload stays a string so existing
 * callers can render it.
 */
export function isUnauthenticatedApplicationLoad(payload: unknown): boolean {
  return (
    typeof payload === 'string' &&
    /^Unable to load application \((401|403)\)$/.test(payload)
  );
}

const slice = createSlice({
  name: 'applicationLoad',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.pending, (state) => {
        // A page that already has an application keeps showing it while a
        // later visit refreshes the session. Retry and the first load do not.
        if (state.status === 'idle' || state.status === 'failed') {
          state.status = 'loading';
        }
      })
      .addCase(loadApplication.fulfilled, (state, action) => {
        state.status = action.payload?.id ? 'loaded' : 'failed';
      })
      .addCase(loadApplication.rejected, (state, action) => {
        state.status = isUnauthenticatedApplicationLoad(action.payload)
          ? 'unauthenticated'
          : 'failed';
      })
      .addCase(exit.fulfilled, () => initialState);
  },
});

export const selectApplicationLoadStatus = (state: {
  applicationLoad: ApplicationLoadState;
}): ApplicationLoadStatus => state.applicationLoad.status;

export default slice;
