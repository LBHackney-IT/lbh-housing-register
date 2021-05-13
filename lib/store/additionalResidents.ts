import { Resident } from "../types/resident"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Resident[] = [
  {
    "formData": {},
    "name": "test user",
    "slug": "test-user"
  }
]

const slice = createSlice({
  name: 'additionalResidents',
  initialState,
  reducers: {
    /**
     * Add additional resident to store
     * @param {{[key: string]: Resident}} state The current residents state
     * @param {PayloadAction<{[key: string]: Resident}>} action The new resident
     * @returns {{[key: string]: Resident}} Updated residents state
     */
     addResident: (state: Resident[], action: PayloadAction<Resident>) => {
      return [
        ...state,
        action.payload
      ]
    }
  }
})

export default slice
export const { addResident } = slice.actions