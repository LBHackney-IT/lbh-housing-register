import agreementFormData from "../../data/forms/agreement.json"
import immigrationStatusFormData from "../../data/forms/immigration-status.json"
import testFormData from "../../data/forms/_test-form.json"
import yourSituationFormData from "../../data/forms/your-situation.json"
import { MultiPageFormData } from "../types/form"

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiPageFormData}
 */
 export function getFormData(form: string): MultiPageFormData {
  switch(form.toLowerCase()) {
    case "immigration-status":
      return getImmigrationStatusFormData()
    
    case "your-situation":
      return getYourSituationFormData()

    default:
      return getTestFormData()
  }
}

/**
 * Get the form data that makes up the agreement form
 * @returns {MultiPageFormData}
 */
 export function getAgreementFormData(): MultiPageFormData {
  return agreementFormData
}

/**
 * Get the form data that makes up the immigration status form
 * @returns {MultiPageFormData}
 */
 export function getImmigrationStatusFormData(): MultiPageFormData {
  return immigrationStatusFormData
}

/**
 * Get the form data that makes up the test form
 * @returns {MultiPageFormData}
 */
 export function getTestFormData(): MultiPageFormData {
  return testFormData
}

/**
 * Get the form data that makes up the 'your situation' form
 * @returns {MultiPageFormData}
 */
 export function getYourSituationFormData(): MultiPageFormData {
  return yourSituationFormData
}