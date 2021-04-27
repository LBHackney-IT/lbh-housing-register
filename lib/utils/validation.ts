import { FormField } from "../types/form"
import * as Yup from "yup"

/**
 * Builds out the validation schema for the form fields that are passed in
 * @param {FormField[]} - The fields to which we build the schema
 * @returns
 */
export function buildValidationSchema(fields: FormField[]) {
  const fieldValidationScheme: { [key: string]: any } = {};

  fields.map(field => {
    if (field.validation || field.type) {
      const fieldType = field.type?.toLowerCase() || field.as?.toLowerCase()
      let yup;

      switch(fieldType) {
        case "checkbox":
          yup = Yup.boolean().oneOf([true], `${field.label} is required`)
          break;
        
        case "checkboxes":
          yup = Yup.array().of(Yup.string())
          break;
        
        case "date":
          yup = Yup.date()
          break;

        case "email":
          yup = Yup.string().email(`${field.label} must be a valid email`)
          break;

        case "number":
          yup = Yup.number().integer(`${field.label} must be a valid number`)
          break;
        
        default:
          yup = Yup.string()
          break;
      }

      if (field.validation?.required) {
        let errorMessage: string
        switch (fieldType) {
          case "checkboxes":
          case "radios":
            errorMessage = "At least one option must be selected"
            break;
          
          default:
            errorMessage = `${field.label} is required`
            break;
        }

        yup = yup.required(errorMessage)
      }

      if (field.validation?.max) {
        let errorMessage: string
        switch (fieldType) {
          case "checkboxes":
            errorMessage = `No more than ${field.validation.max} item${field.validation.max > 1 ? "s" : ""} can be selected`
            break;
          
          case "date":
            errorMessage = `${field.label} must be before ${field.validation.max}`
            break;

          case "number":
            errorMessage = `${field.label} must be no more than ${field.validation.max}`
            break;
          
          default:
            errorMessage = `${field.label} must be at most ${field.validation.max} character${field.validation.max > 1 ? "s" : ""}`
            break;
        }

        yup = yup.max(field.validation.max, errorMessage)
      }

      if (field.validation?.min) {
        let errorMessage: string
        switch (fieldType) {
          case "checkboxes":
            errorMessage = `At least ${field.validation.min} item${field.validation.min > 1 ? "s" : ""} must be selected`
            break;
          
            case "date":
              errorMessage = `${field.label} must be after ${field.validation.min}`
              break;

          case "number":
            errorMessage = `${field.label} must be no less than ${field.validation.min}`
            break;
          
          default:
            errorMessage = `${field.label} must be at least ${field.validation.min} character${field.validation.min > 1 ? "s" : ""}`
            break;
        }

        yup = yup.min(field.validation.min, errorMessage)
      }

      fieldValidationScheme[field.name] = yup;
    }
  })
  
  return Yup.object().shape(fieldValidationScheme)
}