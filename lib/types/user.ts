import { FormData } from "./form"

export type User = {
  formData: {[key: string]: FormData}
  loggedIn: boolean
}