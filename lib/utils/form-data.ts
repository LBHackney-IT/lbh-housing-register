import agreementFormData from "../../data/forms/agreement.json"
import immigrationStatusFormData from "../../data/forms/immigration-status.json"
import testFormData from "../../data/forms/_test-form.json"
import yourSituationFormData from "../../data/forms/your-situation.json"
import { EligibilityCriteria, MultiStepForm } from "../types/form"

/**
 * Get the eligibility criteria from the requested form
 * @param {string} formId - The requested eligibility criteria
 * @returns {EligibilityCriteria}
 */
 export function getEligibilityCriteria(formId: string): EligibilityCriteria[] | undefined {
  const formData = getFormData(formId)
  return formData?.eligibility
}

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiStepForm}
 */
 export function getFormData(form: string): MultiStepForm {
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
 * @returns {MultiStepForm}
 */
 export function getAgreementFormData(): MultiStepForm {
  return agreementFormData
}

/**
 * Get the form data that makes up the immigration status form
 * @returns {MultiStepForm}
 */
 export function getImmigrationStatusFormData(): MultiStepForm {
  return immigrationStatusFormData
}

/**
 * Get the form data that makes up the test form
 * @returns {MultiStepForm}
 */
 export function getTestFormData(): MultiStepForm {
  return testFormData
}

/**
 * Get the form data that makes up the 'your situation' form
 * @returns {MultiStepForm}
 */
 export function getYourSituationFormData(): MultiStepForm {
  return yourSituationFormData
}