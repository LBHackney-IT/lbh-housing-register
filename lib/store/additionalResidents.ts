import { FormData } from "../types/form"
import { Resident } from "../types/resident"
import { generateSlug } from "../utils/resident"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Resident[] = []

const slice = createSlice({
  name: 'additionalResidents',
  initialState,
  reducers: {
    /**
     * Add additional resident to store
     * @param {Resident[]} state The current residents state
     * @param {PayloadAction<{Resident}>} action The new resident
     * @returns {Resident[]} Updated residents state
     */
     addResident: (state: Resident[], action: PayloadAction<Resident>): Resident[] => {
      return [
        ...state,
        action.payload
      ]
    },

    /**
     * Add additional resident to store (using form data)
     * @param {Resident[]} state The current residents state
     * @param {PayloadAction<FormData>} action The new resident
     * @returns {Resident[]} Updated residents state
     */
     addResidentFromFormData: (state: Resident[], action: PayloadAction<FormData>): Resident[] => {
      const resident: Resident = {
        formData: action.payload,
        name: action.payload.name,
        slug: generateSlug(action.payload.name)
      }
      resident.formData = action.payload

      // Prevent duplicates
      const duplicates = state.filter(item => item.slug.match(new RegExp(`^${resident.slug}|(${resident.slug}_\d+)`)))
      if (duplicates.length > 0) {
        resident.slug += `_${duplicates.length}`
      }

      return [
        ...state,
        resident
      ]
    }
  }
})

export default slice
export const { addResident, addResidentFromFormData } = slice.actions