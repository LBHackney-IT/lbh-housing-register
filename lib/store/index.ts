import resident from "./resident"
import { MainResident } from "../types/resident"
import { createStore, combineReducers } from "redux"
import { createWrapper, Context } from "next-redux-wrapper"

export interface Store {
  resident: MainResident
}

const reducer = combineReducers({
  resident: resident.reducer
})

// Store function
const store = (context: Context) => createStore(reducer)
export const wrapper = createWrapper(store)
export default store