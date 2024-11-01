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
  updateApplication: ApiCallStatus;
}

const initialState: HRApiCallsStatusState = {
  updateApplication: {
    callStatus: ApiCallStatusCode.IDLE,
    error: null,
  },
};

export const selectSaveApplicationStatus = (
  state: RootState
): ApiCallStatus | undefined => state.hrApiCallsStatus.updateApplication;

export const hrApiCallsStatus = createSlice({
  name: 'hrApiCallsStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //update application
      .addCase(updateApplication.pending, (state) => {
        state.updateApplication = {
          callStatus: ApiCallStatusCode.PENDING,
          error: null,
        };
      })
      .addCase(updateApplication.fulfilled, (state) => {
        state.updateApplication = {
          callStatus: ApiCallStatusCode.FULFILLED,
          error: null,
        };
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.updateApplication = {
          callStatus: ApiCallStatusCode.REJECTED,
          error: action.payload as string,
        };
      })
      .addDefaultCase(() => {
        initialState;
      });
  },
});
