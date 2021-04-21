import qualificationFormData from "../data/qualification-form.json"
import { FormField, MultiPageFormData } from "./types/form"
import * as Yup from "yup"
import { isYieldExpression } from "typescript"
import { yupToFormErrors } from "formik"

export default class FormsManager {
  static getConditionalDisplayStateOfField(field: FormField, values: {[key: string]: any}): boolean {
    let display = true

    if (field.conditionalDisplay) {
      field.conditionalDisplay.map(condition => {
        if (display && condition.is) {
          display = values[condition.field] === condition.is;
        }

        if (display) {
          display = values[condition.field] !== condition.isNot;
        }
      })
    }

    return display;
  }

  static getInitialValuesFromFields(fields: FormField[]): { [key: string]: boolean | number | object | string } {
    const initialValues: {[key: string]: boolean | number | object | string } = {}
    fields.map(field => initialValues[field.name] = field.initialValue || "")
    return initialValues
  }

  static getQualificationFormData(): MultiPageFormData {
    return qualificationFormData
  }
  
  static getValidationSchemaFromFields(fields: FormField[]) {
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
}