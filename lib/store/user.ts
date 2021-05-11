import { checkEligible } from "../utils/form"
import { User } from "../types/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: User = {
  formData: {},
  isLoggedIn: false
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Log the user in
     * @param {User} state The current state
     * @returns {User} Updated user state
     */
    logIn: (state: User): User => {
      return {
        ...state,
        isLoggedIn: true
      }

      // TODO: user's name, id, ...
    },

    /**
     * Log the user out
     * @returns {User} Initial user state
     */
    logOut: (): User => {
      return initialState
    },

    /**
     * Update user's eligibility status
     * @param {User} state The current state
     * @param {PayloadAction<[boolean, string[]]>} action Is the user eligible?
     * @returns {User} Updated user state
     */
    updateEligibility: (state: User, action: PayloadAction<[boolean, string[]]>): User => {
      return {
        ...state,
        isEligible: action.payload[0],
        ineligibilityReasons: action.payload[1]
      }
    },

    /**
     * Update user's form data
     * @param {User} state The current state
     * @param {PayloadAction<{}>} action The form data
     * @returns {User} Updated user state
     */
    updateFormData: (state: User, action: PayloadAction<{}>): User => {
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