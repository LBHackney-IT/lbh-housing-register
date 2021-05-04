import { FormField, MultiPageFormData } from "../types/form"

/**
 * Determines if the field should be displayed based on the values passed in
 * @param {FormField} field - The field
 * @param {{[key: string]: any}} values - The form values
 * @returns {boolean} - should the field be displayed?
 */
export function getDisplayStateOfField(field: FormField, values: {[key: string]: any}): boolean {
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
 * @returns {{[key: string]: any}} - An object of form values, where the key is the name of the field
 */
export function getInitialValuesFromFields(fields: FormField[]): {[key: string]: any} {
  const initialValues: {[key: string]: any } = {}
  fields.map(field => initialValues[field.name] = field.initialValue || "")
  return initialValues
}

/**
 * Get the initial state / values from the multi page form data/
 * This checks to see if `field.initialValue` is set, otherwise an empty string is returned.
 * @param {MultiPageFormData} data - The multi page form data
 * @returns {{[key: string]: any}} - An object of form values, where the key is the name of the field
 */
export function getInitialValuesFromMultiPageFormData(data: MultiPageFormData): {[key: string]: any} {
  let initialValues: {[key: string]: any } = {}
  data.steps.map(step => initialValues = Object.assign(initialValues, getInitialValuesFromFields(step.fields)));
  return initialValues
}