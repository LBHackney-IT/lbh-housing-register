import { checkEligible } from "../utils/form"
import { MainResident } from "../types/resident"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: MainResident = {
  hasAgreed: false,
  formData: {},
  isLoggedIn: false,
  name: "You",
  slug: "you"
}

const slice = createSlice({
  name: 'resident',
  initialState,
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
        hasAgreed: action.payload
      }
    },

    /**
     * Log the resident in
     * @param {MainResident} state The current state
     * @returns {MainResident} Updated resident state
     */
    logIn: (state: MainResident): MainResident => {
      return {
        ...state,
        isLoggedIn: true
      }

      // TODO: user's name, id, ...
    },

    /**
     * Log the resident out
     * @returns {MainResident} Initial resident state
     */
    logOut: (): MainResident => {
      return initialState
    },

    /**
     * Update resident's form data
     * @param {MainResident} state The current state
     * @param {PayloadAction<{}>} action The form data
     * @returns {MainResident} Updated resident state
     */
    updateFormData: (state: MainResident, action: PayloadAction<{}>): MainResident => {
      state.formData = {
        ...state.formData,
        ...action.payload
      }

      const eligibility = checkEligible(state.formData)
      state.isEligible = eligibility[0]
      state.ineligibilityReasons = eligibility[1]

      return state
    }
  }
})

export default slice
export const { agree, logIn, logOut, updateFormData } = slice.actions