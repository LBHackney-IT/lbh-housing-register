import { FormField } from "../types/form"
import * as Yup from "yup"

/**
 * Builds out the validation schema for the form fields that are passed in
 * @param {FormField[]} fields - The fields to which we build the schema
 * @returns ObjectShapeSchema
 */
export function buildValidationSchema(fields: FormField[]) {
  const fieldValidationScheme: { [key: string]: any } = {};

  fields.map(field => {
    if (field.validation || field.type) {
      const fieldType: string | undefined = field.type?.toLowerCase() || field.as?.toLowerCase()
      let yup: any

      switch(fieldType) {
        case "checkbox":
          const oneOf = field.validation?.required ? [true] : [true, false];
          yup = Yup.boolean().oneOf(oneOf, `${field.label} is required`)
          break;
        
        case "checkboxes":
          yup = Yup.array().of(Yup.string())
          yup = checkRequired(yup, field, "At least one option must be selected")
          yup = checkMinimumLength(yup, field, `No less than ${field.validation?.min} item${field.validation?.min! > 1 ? "s" : ""} can be selected`)
          yup = checkMaximumLength(yup, field, `No more than ${field.validation?.max} item${field.validation?.max! > 1 ? "s" : ""} can be selected`)
          break;
        
        case "date":
          yup = Yup.date()
          yup = checkRequired(yup, field)
          yup = checkMinimumLength(yup, field, `${field.label} must be on or after ${field.validation?.min}`)
          yup = checkMaximumLength(yup, field, `${field.label} must be on or before ${field.validation?.max}`)
          break;

        case "email":
          yup = Yup.string().email(`${field.label} must be a valid email`)
          yup = checkRequired(yup, field)
          yup = checkMinimumLength(yup, field)
          yup = checkMaximumLength(yup, field)
          break;

        case "number":
          yup = Yup.number().integer(`${field.label} must be a valid number`)
          yup = checkRequired(yup, field)
          yup = checkMinimumLength(yup, field, `${field.label} must be no less than ${field.validation?.min}`)
          yup = checkMaximumLength(yup, field, `${field.label} must be no more than ${field.validation?.max}`)
          break;
        
        default:
          yup = Yup.string()
          yup = checkRequired(yup, field)
          yup = checkMinimumLength(yup, field)
          yup = checkMaximumLength(yup, field)
          break;
      }

      fieldValidationScheme[field.name] = yup;
    }
  })
  
  return Yup.object().shape(fieldValidationScheme)
}

/**
 * Checks to see if the field has a maximum constraint set, and if so will update the yup schema to reflect this
 * @param {any} yup - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkMaximumLength(yup: any, field: FormField, errorMessage?: string): Yup.BaseSchema {
  if (field.validation && field.validation.max)
  {
    errorMessage = errorMessage || `${field.label} must be at most ${field.validation.max} character${field.validation.max > 1 ? "s" : ""}`
    return yup.max(field.validation.max, errorMessage)
  }

  return yup
}

/**
 * Checks to see if the field has a minimum constraint set, and if so will update the yup schema to reflect this
 * @param {any} yup - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkMinimumLength(yup: any, field: FormField, errorMessage?: string): Yup.BaseSchema {
  if (field.validation && field.validation.min)
  {
    errorMessage = errorMessage || `${field.label} must be at least ${field.validation.min} character${field.validation.min > 1 ? "s" : ""}`
    return yup.min(field.validation.min, errorMessage)
  }

  return yup
}

/**
 * Checks to see if the field is required, and if so will update the yup schema to reflect this
 * @param {Yup.BaseSchema} yup - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkRequired(yup: Yup.BaseSchema, field: FormField, errorMessage?: string): Yup.BaseSchema {
  errorMessage = errorMessage || `${field.label} is required`
  return field.validation?.required ? yup.required(errorMessage) : yup
}