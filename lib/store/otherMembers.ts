import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { v4 as uuidv4 } from 'uuid';
// import { loadApplication } from './application';
import { Applicant } from '../../domain/HousingApi';
import { applyQuestions, updateApplicantReducer } from './applicant';

const initialState: Applicant[] = [];

const slice = createSlice({
  name: 'otherMembers',
  initialState: initialState as Applicant[] | undefined,

  reducers: {
    createAdditionalApplicants: (state = [], action: PayloadAction<number>) =>
      new Array(action.payload)
        .fill(undefined)
        .map(() => ({ person: { id: 'temp-' + uuidv4() } })),

    updateAdditionalApplicant: (
      state = [],
      action: PayloadAction<Applicant>
    ) => {
      const applicant = state.findIndex(
        (p) => p.person?.id && p.person?.id === action.payload.person?.id
      );
      // Immer
      state[applicant] = updateApplicantReducer(state[applicant], action);
      return state;
    },
    updateAdditionalApplicantWithFormValues: (
      state = [],
      action: PayloadAction<{
        activeStepId: string;
        id: string;
        values: FormikValues;
      }>
    ) => {
      const applicant = state.findIndex(
        (p) => p.person?.id && p.person?.id === action.payload.id
      );
      // Immer
      state[applicant] = applyQuestions(
        state[applicant],
        action.payload.activeStepId,
        action.payload.values
      );

      return state;
    },

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
          id: uuidv4(), // TODO generate on the server instead.
          firstName: action.payload.firstName,
          surname: action.payload.surname,
          gender: action.payload.gender,
          // TODO date of birth needs to be a string.
          // dateOfBirth: action.payload.birthday,
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
});

export default slice;
export const {
  createAdditionalApplicants,
  updateAdditionalApplicantWithFormValues,
  updateAdditionalApplicant,
  addApplicant,
  addResidentFromFormData,
  deleteApplicant,
} = slice.actions;
