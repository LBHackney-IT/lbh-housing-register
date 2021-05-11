import { FormData } from "./form"

export type Resident = {
  formData: {[key: string]: FormData}
  ineligibilityReasons?: string[]
  isEligible?: boolean
  isLoggedIn: boolean
}