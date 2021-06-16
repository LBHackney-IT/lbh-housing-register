import { FormData, FormField } from '../types/form';
import * as Yup from 'yup';

/**
 * Builds out the validation schema for the form fields that are passed in
 * @param {FormField[]} fields - The fields to which we build the schema
 * @returns ObjectShapeSchema
 */
export function buildValidationSchema(fields: FormField[]) {
  const validationSchema: FormData = {};

  fields.map((field) => {
    if (field.validation || field.type) {
      let baseType: Yup.BaseSchema;
      const fieldType: string | undefined =
        field.type?.toLowerCase() || field.as?.toLowerCase();
      let fieldValidation: any;

      switch (fieldType) {
        case 'checkbox':
          const oneOf = field.validation?.required ? [true] : [true, false];
          baseType = Yup.boolean().oneOf(oneOf, `${field.label} is required`);

          fieldValidation = baseType;
          fieldValidation = checkRequired(
            fieldValidation,
            field,
            `${field.label} must be selected`
          );
          break;

        case 'checkboxes':
          baseType = fieldValidation = Yup.array().of(Yup.string());

          fieldValidation = baseType;
          fieldValidation = checkRequired(
            fieldValidation,
            field,
            'At least one option must be selected'
          );
          fieldValidation = checkMinimumLength(
            fieldValidation,
            field,
            `No less than ${field.validation?.min} item${
              field.validation?.min! > 1 ? 's' : ''
            } can be selected`
          );
          fieldValidation = checkMaximumLength(
            fieldValidation,
            field,
            `No more than ${field.validation?.max} item${
              field.validation?.max! > 1 ? 's' : ''
            } can be selected`
          );
          break;

        case 'date':
          baseType = Yup.date();

          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field);
          fieldValidation = checkMinimumLength(
            fieldValidation,
            field,
            `${field.label} must be on or after ${field.validation?.min}`
          );
          fieldValidation = checkMaximumLength(
            fieldValidation,
            field,
            `${field.label} must be on or before ${field.validation?.max}`
          );
          break;

        case 'email':
          baseType = Yup.string().email(`${field.label} must be a valid email`);

          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field);
          fieldValidation = checkMinimumLength(fieldValidation, field);
          fieldValidation = checkMaximumLength(fieldValidation, field);
          break;

        case 'number':
          baseType = Yup.number().integer(
            `${field.label} must be a valid number`
          );

          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field);
          fieldValidation = checkMinimumLength(
            fieldValidation,
            field,
            `${field.label} must be no less than ${field.validation?.min}`
          );
          fieldValidation = checkMaximumLength(
            fieldValidation,
            field,
            `${field.label} must be no more than ${field.validation?.max}`
          );
          break;

        case 'birthdayinput':
          baseType = Yup.number().integer(
            `${field.label} must be a valid number`
          );
          
          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field);
          break;

        default:
          baseType = Yup.string();

          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field);
          fieldValidation = checkMinimumLength(fieldValidation, field);
          fieldValidation = checkMaximumLength(fieldValidation, field);
          break;
      }

      fieldValidation = setUpConditionalValidation(
        fieldValidation,
        field,
        baseType
      );
      validationSchema[field.name] = fieldValidation;
    }
  });

  return Yup.object().shape(validationSchema);
}

/**
 * Checks to see if the field has a maximum constraint set, and if so will update the yup schema to reflect this
 * @param {any} fieldValidationSchema - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkMaximumLength(
  fieldValidationSchema: any,
  field: FormField,
  errorMessage?: string
): Yup.BaseSchema {
  if (field.validation && field.validation.max) {
    errorMessage =
      errorMessage ||
      `${field.label} must be at most ${field.validation.max} character${
        field.validation.max > 1 ? 's' : ''
      }`;
    return fieldValidationSchema.max(field.validation.max, errorMessage);
  }

  return fieldValidationSchema;
}

/**
 * Checks to see if the field has a minimum constraint set, and if so will update the yup schema to reflect this
 * @param {any} fieldValidationSchema - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkMinimumLength(
  fieldValidationSchema: any,
  field: FormField,
  errorMessage?: string
): Yup.BaseSchema {
  if (field.validation && field.validation.min) {
    errorMessage =
      errorMessage ||
      `${field.label} must be at least ${field.validation.min} character${
        field.validation.min > 1 ? 's' : ''
      }`;
    return fieldValidationSchema.min(field.validation.min, errorMessage);
  }

  return fieldValidationSchema;
}

/**
 * Checks to see if the field is required, and if so will update the yup schema to reflect this
 * @param {Yup.BaseSchema} fieldValidationSchema - Yup schema which we potentially amend
 * @param {FormField} field - The field which we are checking validation against
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns {Yup.BaseSchema} - The yup schema
 */
function checkRequired(
  fieldValidationSchema: Yup.BaseSchema,
  field: FormField,
  errorMessage?: string
): Yup.BaseSchema {
  errorMessage = errorMessage || `${field.label} is required`;
  return field.validation?.required
    ? fieldValidationSchema.required(errorMessage)
    : fieldValidationSchema;
}

/**
 * Set up conditional validation for conditional fields
 * This will ensure that hidden fields do not interrupt validation, allowing the user to progress forms
 * @param fieldValidationSchema - The validation schema (when the condition has been met)
 * @param field - The field which we are validating against
 * @param baseType - The base validation schema (for the current type), this will be used always (in the case where the conditions are not met)
 * @returns Up to date validation schema with conditional logic (if relevant)
 */
function setUpConditionalValidation(
  fieldValidationSchema: Yup.BaseSchema,
  field: FormField,
  baseType: Yup.BaseSchema
): Yup.BaseSchema {
  if (field.conditionalDisplay) {
    const conditionalLogicFields: string[] = field.conditionalDisplay.map(
      (condition) => condition.field
    );
    fieldValidationSchema = baseType.when(conditionalLogicFields, {
      is: (...values: any[]) => {
        let isValid = true;

        field.conditionalDisplay?.map((condition, index) => {
          if (isValid && condition.is && condition.is != values[index]) {
            isValid = false;
          }

          if (isValid && condition.isNot && condition.isNot == values[index]) {
            isValid = false;
          }
        });

        return isValid;
      },
      then: fieldValidationSchema,
    });
  }

  return fieldValidationSchema;
}
