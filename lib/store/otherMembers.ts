import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

import { Applicant } from '../../domain/HousingApi';
import {
  applyQuestions,
  updateApplicant,
  updateApplicantReducer,
  updateWithFormValues,
} from './applicant';

import { Store } from '.';

const initialState: Applicant[] = [];

export const removeApplicant = createAsyncThunk(
  'applicant/remove',
  async (id: string, { getState }) => {
    const store: Store = getState() as Store;
    return store.application.otherMembers?.filter(
      (resident) => resident.person?.id !== id
    );
  }
);

const slice = createSlice({
  name: 'otherMembers',
  initialState: initialState as Applicant[] | undefined,

  reducers: {
    /**
     * Add additional resident to store
     */
    addApplicant: (
      state = [],
      action: PayloadAction<Applicant>
    ): Applicant[] => {
      return [...state, action.payload];
    },

    /**
     * Add additional resident to store (using form data)
     */
    addResidentFromFormData: (
      state = [],
      action: PayloadAction<FormikValues>
    ) => {
      const applicant: Applicant = {
        person: {
          title: action.payload.title,
          firstName: action.payload.firstName,
          surname: action.payload.surname,
          dateOfBirth: action.payload.dateOfBirth,
          gender: action.payload.gender,
          genderDescription: action.payload.genderDescription,
          nationalInsuranceNumber: action.payload.nationalInsuranceNumber,
          relationshipType: action.payload.relationshipType,
        },
        contactInformation: {
          phoneNumber: action.payload.phoneNumber,
          emailAddress: action.payload.emailAddress,
        },
      };

      return [...state, applicant];
    },

    /**
     * Delete resident
     */
    deleteApplicant: (state = [], action: PayloadAction<Applicant>) =>
      state.filter(
        (resident) => resident.person?.id !== action.payload.person?.id
      ),
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeApplicant.fulfilled, (state, action) => action.payload)
      .addCase(updateApplicant, (state = [], action) => {
        const applicant = state.findIndex(
          (p) => p.person?.id && p.person.id === action.payload.person.id
        );
        if (applicant > -1) {
          state[applicant] = updateApplicantReducer(
            state[applicant],
            action.payload
          );
        }
        return state;
      })
      .addCase(updateWithFormValues, (state = [], action) => {
        const applicant = state.findIndex(
          (p) => p.person?.id && p.person.id === action.payload.personID
        );
        if (applicant > -1) {
          if (action.payload.markAsComplete) {
            action.payload.values.sectionCompleted = true;
          }
          state[applicant] = applyQuestions(
            state[applicant],
            action.payload.formID,
            action.payload.values
          );
        }
        return state;
      });
  },
});

export default slice;
export const {
  addApplicant,
  addResidentFromFormData,
  deleteApplicant,
} = slice.actions;
