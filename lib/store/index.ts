import additionalResidents from './additionalResidents';
import resident from './resident';
import { MainResident, Resident } from '../types/resident';
import { combineReducers } from 'redux';
import { createWrapper, Context } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';

export interface Store {
  applicationId: string
  resident: MainResident
  additionalResidents: Resident[]
}

const reducer = combineReducers({
  resident: resident.reducer,
  additionalResidents: additionalResidents.reducer
})

// Store function
const store = (context: Context) => configureStore({reducer, devTools: true})
export const wrapper = createWrapper(store)
export default store
