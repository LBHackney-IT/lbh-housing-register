import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import { Application } from '../../domain/HousingApi';
import application, { autoSaveMiddleware } from './application';
import { hrApiCallsStatus, HRApiCallsStatusState } from './apiCallsStatus';

export interface Store {
  application: Application;
  hrApiCallsStatus: HRApiCallsStatusState;
}

const reducer = combineReducers<Store>({
  application: application.reducer,
  hrApiCallsStatus: hrApiCallsStatus.reducer,
});

const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(autoSaveMiddleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper(makeStore);
