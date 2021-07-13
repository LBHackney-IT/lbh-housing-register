import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import { Application } from '../../domain/HousingApi';
import application, { loadApplicaiton, updateApplication } from './application';
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
      (storeAPI) => (next) => (action) => {
        const previousApplication = storeAPI.getState().application;
        const newAction = next(action);
        const newApplication = storeAPI.getState().application;

        if (
          previousApplication !== newApplication &&
          !action.type.startsWith(loadApplicaiton.typePrefix) &&
          newApplication.id
        ) {
          storeAPI.dispatch(updateApplication(newApplication));
        }

        return newAction;
      },
    ],
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper(makeStore);
