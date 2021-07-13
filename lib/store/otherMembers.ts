import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
// import { loadApplicaiton } from './application';
import { Applicant } from '../../domain/HousingApi';
import { FormData } from '../types/form';


const initialState: Applicant[] = [];

const slice = createSlice({
  name: 'otherMembers',
  initialState: initialState as Applicant[] | undefined,

  // extraReducers: (builder) => {
  //   builder.addCase(loadApplicaiton.fulfilled, (state, action) => {
  //     return action.payload.otherMembers;
  //   });
  //   builder.addCase(loadApplicaiton.rejected, () => initialState);
  // },

  reducers: {
    /**
     * Add additional resident to store
     * @param {Resident[]} state The current residents state
     * @param {PayloadAction<{Resident}>} action The new resident
     * @returns {Resident[]} Updated residents state
     */
    addResident: (
      state: Resident[],
      action: PayloadAction<Resident>
    ): Resident[] => {
      return [...state, action.payload];
    },

    /**
     * Add additional resident to store (using form data)
     * @param {Resident[]} state The current residents state
     * @param {PayloadAction<FormData>} action The new resident
     * @returns {Resident[]} Updated residents state
     */
    addResidentFromFormData: (state, action: PayloadAction<FormData>) => {
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

      return [...(state || []), applicant];
    },

    /**
     * Delete resident
     * @param {Resident[]} state The current state
     * @param {PayloadAction<Resident>} action The resident we wish to delete
     * @returns {Resident[]} New state with resident removed
     */
    deleteResident: (
      state: Resident[],
      action: PayloadAction<Resident>
    ): Resident[] => {
      const newState = state.filter(
        (resident) => resident.slug != action.payload.slug
      );
      return [...newState];
    },

    /**
     * Update residents record
     * @param {Resident[]} state The current state
     * @param {PayloadAction<Resident>} action The resident we wish to update
     * @returns {Resident[]} New state with updated resident
     */
    updateResident: (
      state: Resident[],
      action: PayloadAction<Resident>
    ): Resident[] => {
      let index = 0;
      const newState = [...state];

      newState.forEach((resident, i) => {
        if (resident.slug == action.payload.slug) {
          index = i;
        }
      });

      newState[index] = action.payload;

      return newState;
    },
  },
});

export default slice;
export const {
  addResident,
  addResidentFromFormData,
  deleteResident,
  updateResident,
} = slice.actions;
