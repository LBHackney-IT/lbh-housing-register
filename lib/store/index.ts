import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import { Application } from '../../domain/HousingApi';
import application, { autoSaveMiddleware } from './application';

export interface Store {
  application: Application;
}

const reducer = combineReducers<Store>({
  application: application.reducer,
});

export const makeStore = (preloadedState: Partial<RootState>) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(autoSaveMiddleware),
  });

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

// @ts-expect-error create wrapper throws test error. Needs correting
export const wrapper = createWrapper(makeStore, { debug: true });
