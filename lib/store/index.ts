import additionalResidents from './additionalResidents';
import resident from './resident';
import { MainResident, Resident } from '../types/resident';
import { combineReducers } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';
import cognitoUser, { CognitoUserInfo } from './cognitoUser';

export interface Store {
  additionalResidents: Resident[];
  resident: MainResident;
  cognitoUser: CognitoUserInfo | null;
}

const reducer = combineReducers<Store>({
  additionalResidents: additionalResidents.reducer,
  resident: resident.reducer,
  cognitoUser: cognitoUser.reducer,
});

const makeStore = () => configureStore({ reducer });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper(makeStore);
