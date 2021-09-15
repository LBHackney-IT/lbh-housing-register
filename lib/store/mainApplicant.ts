import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '.';
import { Applicant } from '../../domain/HousingApi';
import { FormID } from '../utils/form-data';
import {
  applicantHasId,
  applyQuestions,
  updateApplicant,
  updateApplicantReducer,
  updateWithFormValues,
} from './applicant';

const initialState: Applicant = {};
const slice = createSlice({
  name: 'mainApplicant',
  initialState: initialState as Applicant | undefined,
  reducers: {
    agree: (state) => applyQuestions(state, FormID.AGREEMENT, { agree: true }),
    updateBeforeFirstSave: (state, action: PayloadAction<Applicant>) => {
      if (applicantHasId(state)) {
        throw new Error('Record has an ID, use updateApplicant instead');
      }
      return updateApplicantReducer(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateApplicant, (state, action) => {
        if (
          state?.person?.id &&
          state?.person?.id === action.payload.person.id
        ) {
          return updateApplicantReducer(state, action.payload);
        }
        return state;
      })
      .addCase(updateWithFormValues, (state, action) => {
        if (
          state?.person?.id &&
          state?.person?.id === action.payload.personID
        ) {
          if (action.payload.markAsComplete) {
            action.payload.values['sectionCompleted'] = true;
          }
          return applyQuestions(
            state,
            action.payload.formID,
            action.payload.values
          );
        }
        return state;
      });
  },
});

export function selectHasAgreed(store: Store) {
  return (
    store.application?.mainApplicant?.questions?.find(
      (q) => q.id === `${FormID.AGREEMENT}/agree`
    )?.answer === 'true'
  );
}

export default slice;
export const { agree, updateBeforeFirstSave } = slice.actions;
