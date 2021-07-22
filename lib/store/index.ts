import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import { Application } from '../../domain/HousingApi';
import application, { autoSaveMiddleware } from './application';
import cognitoUser, { CognitoUserInfo } from './cognitoUser';

export interface Store {
  application: Application;
  cognitoUser: CognitoUserInfo | null;
}

const reducer = combineReducers<Store>({
  application: application.reducer,
  cognitoUser: cognitoUser.reducer,
});

const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      autoSaveMiddleware,
    ],
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper(makeStore);
