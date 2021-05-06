import user from "./user"
import { User } from "../types/user"
import { createStore, combineReducers } from "redux"
import { createWrapper, Context } from "next-redux-wrapper"

export interface Store {
  user: User
}

const reducer = combineReducers({
  user: user.reducer
})

// Store function
const store = (context: Context) => createStore(reducer)
export const wrapper = createWrapper(store);
export default store