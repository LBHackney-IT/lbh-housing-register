import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { updateApplication } from './application';

export enum ApiCallStatusCode {
  'IDLE',
  'PENDING',
  'FULFILLED',
  'REJECTED',
}

export interface ApiCallStatus {
  callStatus: ApiCallStatusCode;
  error?: string | null;
}

export interface HRApiCallsStatusState {
  patchApplication: ApiCallStatus;
}

const initialState: HRApiCallsStatusState = {
  patchApplication: {
    callStatus: ApiCallStatusCode.IDLE,
    error: null,
  },
};

export const selectPatchApplicationStatus = (
  state: RootState
): ApiCallStatus | undefined => state.hrApiCallsStatus.patchApplication;

export const hrApiCallsStatus = createSlice({
  name: 'hrApiCallsStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateApplication.pending, (state) => {
        state.patchApplication = {
          callStatus: ApiCallStatusCode.PENDING,
          error: null,
        };
      })
      .addCase(updateApplication.fulfilled, (state) => {
        state.patchApplication = {
          callStatus: ApiCallStatusCode.FULFILLED,
          error: null,
        };
      })
      .addCase(updateApplication.rejected, (state, action) => {
        console.dir(action.payload);
        state.patchApplication = {
          callStatus: ApiCallStatusCode.REJECTED,
          error: action.payload as string,
        };
      })
      .addDefaultCase((state) => {
        state.patchApplication = {
          callStatus: ApiCallStatusCode.IDLE,
          error: null,
        };
      });
  },
});
