import { FormData, FormField, MultiStepForm } from "../types/form"

/**
 * Determines if the field should be displayed based on the values passed in
 * @param {FormField} field - The field
 * @param {FormData} values - The form values
 * @returns {boolean} - should the field be displayed?
 */
export function getDisplayStateOfField(field: FormField, values: FormData): boolean {
  let display = true

  if (field.conditionalDisplay) {
    field.conditionalDisplay.map(condition => {
      if (display && condition.is) {
        display = values[condition.field] === condition.is;
      }

      if (display && condition.isNot) {
        display = values[condition.field] !== condition.isNot;
      }
    })
  }

  return display;
}

/**
 * Get the initial state / values.
 * This checks to see if `field.initialValue` is set, otherwise an empty string is returned.
 * @param {FormField[]} fields - The fields
 * @returns {FormData} - An object of form values, where the key is the name of the field
 */
export function getInitialValuesFromFields(fields: FormField[]): FormData {
  const initialValues: FormData = {}
  fields.map(field => initialValues[field.name] = field.initialValue || "")
  return initialValues
}

/**
 * Get the initial state / values from the multi page form data/
 * This checks to see if `field.initialValue` is set, otherwise an empty string is returned.
 * @param {MultiStepForm} data - The multi page form data
 * @returns {FormData} - An object of form values, where the key is the name of the field
 */
export function getInitialValuesFromMultiStepForm(data: MultiStepForm): FormData {
  let initialValues: FormData = {}
  data.steps.map(step => initialValues = Object.assign(initialValues, getInitialValuesFromFields(step.fields)));
  return initialValues
}