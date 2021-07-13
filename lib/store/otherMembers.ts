import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { v4 as uuidv4 } from 'uuid';
// import { loadApplicaiton } from './application';
import { Applicant } from '../../domain/HousingApi';


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
    addResidentFromFormData: (state = [], action: PayloadAction<FormikValues>) => {
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
    deleteApplicant: (
      state = [],
      action: PayloadAction<Applicant>
    ) => state.filter(
      (resident) => resident.person?.id !== action.payload.person?.id
    ),
  },
});

export default slice;
export const {
  addApplicant,
  addResidentFromFormData,
  deleteApplicant,
} = slice.actions;
