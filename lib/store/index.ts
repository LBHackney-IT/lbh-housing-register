import additionalResidents from './additionalResidents';
import resident from './resident';
import { MainResident, Resident } from '../types/resident';
import { combineReducers } from 'redux';
import { createWrapper, Context } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';

export interface Store {
  additionalResidents: Resident[];
  resident: MainResident;
}

const reducer = combineReducers({
  additionalResidents: additionalResidents.reducer,
  resident: resident.reducer,
});

const store = () => configureStore({ reducer });

export const wrapper = createWrapper(store);
export default store;
