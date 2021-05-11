import { checkEligible } from "../utils/form"
import { Resident } from "../types/resident"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Resident = {
  formData: {},
  isLoggedIn: false
}

const slice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    /**
     * Log the resident in
     * @param {Resident} state The current state
     * @returns {Resident} Updated resident state
     */
    logIn: (state: Resident): Resident => {
      return {
        ...state,
        isLoggedIn: true
      }

      // TODO: user's name, id, ...
    },

    /**
     * Log the resident out
     * @returns {Resident} Initial resident state
     */
    logOut: (): Resident => {
      return initialState
    },

    /**
     * Update resident's eligibility status
     * @param {Resident} state The current state
     * @param {PayloadAction<[boolean, string[]]>} action Is the resident eligible?
     * @returns {Resident} Updated resident state
     */
    updateEligibility: (state: Resident, action: PayloadAction<[boolean, string[]]>): Resident => {
      return {
        ...state,
        isEligible: action.payload[0],
        ineligibilityReasons: action.payload[1]
      }
    },

    /**
     * Update resident's form data
     * @param {Resident} state The current state
     * @param {PayloadAction<{}>} action The form data
     * @returns {Resident} Updated resident state
     */
    updateFormData: (state: Resident, action: PayloadAction<{}>): Resident => {
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
export const { logIn, logOut, updateEligibility, updateFormData } = slice.actions