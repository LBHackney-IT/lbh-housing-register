import { checkEligible } from '../utils/form';
import { MainResident, Resident } from '../types/resident';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadApplicaiton } from './application';
import { extractFormData } from '../utils/helper';

export const MAIN_RESIDENT_KEY = 'you'; // Why is this the main resident key?

const initialState: MainResident = {
  hasAgreed: false,
  formData: {},
  isLoggedIn: false,
  username: '',
  name: 'You',
  slug: MAIN_RESIDENT_KEY,
};

const slice = createSlice({
  name: 'resident',
  initialState: initialState as Resident,
  extraReducers: (builder) => {
    builder.addCase(loadApplicaiton.fulfilled, (state, action) => {
      state.formData = extractFormData(action.payload.mainApplicant);
    });
  },
  reducers: {
    /**
     * Agree to terms and conditions
     * @param {MainResident} state The current state
     * @param {PayloadAction<boolean>} action The agreement state
     * @returns {MainResident} Updated resident state
     */
    agree: (state: MainResident, action: PayloadAction<boolean>) => {
      return {
        ...state,
        hasAgreed: action.payload,
      };
    },

    /**
     * Register the resident
     * @param {MainResident} state The current state
     * @param {PayloadAction<string>} action The residents name
     * @returns {MainResident} Updated resident state
     */
    createUser: (
      state: MainResident,
      action: PayloadAction<string>
    ): MainResident => {
      return {
        ...state,
        username: action.payload,
      };
    },

    /**
     * Log the resident in
     * @param {MainResident} state The current state
     * @param {PayloadAction<string>} action The residents name
     * @returns {MainResident} Updated resident state
     */
    logIn: (
      state: MainResident,
      action: PayloadAction<string>
    ): MainResident => {
      return {
        ...state,
        username: action.payload,
        isLoggedIn: true,
      };
    },

    /**
     * Log the resident out
     * @returns {MainResident} Initial resident state
     */
    logOut: (): MainResident => {
      return initialState;
    },

    /**
     * Update resident's form data
     * @param {MainResident} state The current state
     * @param {PayloadAction<{[key: string]: FormData}>} action The form data
     * @returns {MainResident} Updated resident state
     */
    updateFormData: (
      state: MainResident,
      action: PayloadAction<{ [key: string]: FormData }>
    ): MainResident => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };

      const eligibility = checkEligible(state.formData);
      state.isEligible = eligibility[0];
      state.ineligibilityReasons = eligibility[1];

      // Update name to reflect on the main overview page
      state.name = (state.formData.firstName && state.formData.lastName) ? state.formData.firstName + ' ' + state.formData.lastName : 'You'

      return state;
    },
  },
});

export default slice;
export const { agree, createUser, logIn, logOut, updateFormData } =
  slice.actions;
