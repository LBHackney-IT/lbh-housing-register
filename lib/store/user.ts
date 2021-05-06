import { User } from "../types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  formData: {},
  loggedIn: false
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFormData: (state: User, action: PayloadAction<{}>) => {
      state.formData = {
        ...state.formData,
        ...action.payload
      }
    },

    logIn: (state: User, action: PayloadAction) => {
      return {
        ...state,
        loggedIn: true
      }

      // TODO: user's name, id, ...
    },

    logOut: (): User => {
      return initialState
    }
  }
})

export default slice
export const { logIn, logOut, updateFormData } = slice.actions