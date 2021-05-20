import agreementFormData from "../../data/forms/agreement.json"
import immigrationStatusFormData from "../../data/forms/immigration-status.json"
import personalDetailsFormData from "../../data/forms/person-details.json"
import addressDetailsFormData from "../../data/forms/address-details.json"
import testFormData from "../../data/forms/_test-form.json"
import yourSituationFormData from "../../data/forms/your-situation.json"
import { EligibilityCriteria, MultiStepForm } from "../types/form"

export const AGREEMENT = "agreement"
export const IMMIGRATION_STATUS = "immigration-status"
export const PERSONAL_DETAILS = "personal-details"
export const ADDRESS_DETAILS = "address-details"
export const YOUR_SITUATION = "your-situation"

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
  switch (form.toLowerCase()) {
    case "agreement":
      return getAgreementFormData()

    case "your-situation":
      return getYourSituationFormData()

    case "immigration-status":
      return getImmigrationStatusFormData()

    case "personal-details":
      return getPersonalDetailsFormData()

    case "address-details":
      return getAddressDetailsFormData()

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
 * Get the form data that makes up the personal details form
 * @returns {MultiStepForm}
 */
export function getPersonalDetailsFormData(): MultiStepForm {
  return personalDetailsFormData
}

/**
 * Get the form data that makes up the personal details form
 * @returns {MultiStepForm}
 */
export function getAddressDetailsFormData(): MultiStepForm {
  return addressDetailsFormData
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
