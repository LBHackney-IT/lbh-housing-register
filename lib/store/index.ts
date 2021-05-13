import additionalResidents from "./additionalResidents"
import resident from "./resident"
import { MainResident, Resident } from "../types/resident"
import { createStore, combineReducers } from "redux"
import { createWrapper, Context } from "next-redux-wrapper"

export interface Store {
  additionalResidents: Resident[]
  resident: MainResident
}

const reducer = combineReducers({
  additionalResidents: additionalResidents.reducer,
  resident: resident.reducer
})

// Store function
const store = (context: Context) => createStore(reducer)
export const wrapper = createWrapper(store)
export default store