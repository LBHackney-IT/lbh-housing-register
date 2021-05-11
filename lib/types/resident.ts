import { FormData } from "./form"

export interface Resident {
  formData: {[key: string]: FormData}
  ineligibilityReasons?: string[]
  isEligible?: boolean
}

export interface MainResident extends Resident {
  hasAgreed: boolean
  isLoggedIn: boolean
}