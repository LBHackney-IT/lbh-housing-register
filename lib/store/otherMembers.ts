import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { Applicant } from '../../domain/HousingApi';
import {
  applyQuestions,
  updateApplicant,
  updateApplicantReducer,
  updateWithFormValues,
} from './applicant';

const initialState: Applicant[] = [];

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
          firstName: action.payload.firstName,
          surname: action.payload.surname,
          dateOfBirth: action.payload.birthday,
          gender: action.payload.gender,
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
      .addCase(updateApplicant, (state = [], action) => {
        const applicant = state.findIndex(
          (p) => p.person?.id && p.person.id === action.payload.person.id
        );
        // Immer
        state[applicant] = updateApplicantReducer(
          state[applicant],
          action.payload
        );
        return state;
      })
      .addCase(updateWithFormValues, (state = [], action) => {
        const applicant = state.findIndex(
          (p) => p.person?.id && p.person.id === action.payload.personID
        );

        // Immer
        state[applicant] = applyQuestions(
          state[applicant],
          action.payload.formID,
          action.payload.values
        );
        return state;
      });
  },
});

export default slice;
export const { addApplicant, addResidentFromFormData, deleteApplicant } =
  slice.actions;
