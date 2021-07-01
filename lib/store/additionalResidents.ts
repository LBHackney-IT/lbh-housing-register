import { FormData } from '../types/form';
import { Resident } from '../types/resident';
import { generateSlug } from '../utils/resident';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadApplicaiton } from './application';
import { extractFormData } from '../utils/helper';

const initialState: Resident[] = [];

const slice = createSlice({
  name: 'additionalResidents',
  initialState,

  extraReducers: (builder) => {
    builder.addCase(loadApplicaiton.fulfilled, (state, action) => {
      return action.payload.otherMembers.map<Resident>((resident) => ({
        name: '',
        slug: '',
        formData: extractFormData(resident),
      }));
    });
    builder.addCase(loadApplicaiton.rejected, () => initialState);
  },

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
    addResidentFromFormData: (
      state: Resident[],
      action: PayloadAction<FormData>
    ): Resident[] => {
      const resident: Resident = {
        formData: action.payload,
        name: action.payload.firstName,
        slug: generateSlug(action.payload.firstName),
      };
      resident.formData = {
        'personal-details': action.payload,
      };

      // Prevent duplicates
      const duplicates = state.filter((item) =>
        item.slug.match(new RegExp(`^${resident.slug}|(${resident.slug}_\d+)`))
      );
      if (duplicates.length > 0) {
        resident.slug += `_${duplicates.length}`;
      }

      return [...state, resident];
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
