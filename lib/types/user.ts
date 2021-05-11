import { FormData } from "./form"

export type User = {
  formData: {[key: string]: FormData}
  ineligibilityReasons?: string[]
  isEligible?: boolean
  isLoggedIn: boolean
}