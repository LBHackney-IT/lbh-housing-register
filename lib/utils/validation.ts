import { setIn } from 'formik';
import * as Yup from 'yup';
import { INVALID_DATE } from '../../components/form/dateinput';
import { FormField } from '../types/form';

/**
 * Builds out the validation schema for the form fields that are passed in
 * @param {FormField[]} fields - The fields to which we build the schema
 * @returns ObjectShapeSchema
 */
export function buildValidationSchema(fields: FormField[]) {
  const validationSchema = fields.reduce((acc, field) => {
    if (field.validation || (field.as === undefined && field.type)) {
      let baseType: Yup.BaseSchema | undefined;
      let fieldValidation: Yup.BaseSchema | undefined;

      switch (field.as) {
        case 'checkbox':
          const oneOf = field.validation?.required ? [true] : [true, false];
          baseType = Yup.boolean().oneOf(oneOf, `${field.label} is required`);

          fieldValidation = baseType;
          fieldValidation = checkRequired(
            fieldValidation,
            field,
            baseType,
            `${field.label} must be selected`
          );
          break;

        case 'checkboxes':
          baseType = fieldValidation = Yup.array().of(Yup.string());

          fieldValidation = baseType;
          fieldValidation = checkRequired(
            fieldValidation,
            field,
            baseType,
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

        case 'dateinput':
          baseType = Yup.string().notOneOf([INVALID_DATE], 'Invalid date');

          fieldValidation = baseType;
          fieldValidation = checkRequired(fieldValidation, field, baseType);
          break;

        case undefined:
          switch (field.type) {
            case 'email':
              baseType = Yup.string().email(
                `${field.label} must be a valid email`
              );

              fieldValidation = baseType;
              fieldValidation = checkRequired(fieldValidation, field, baseType);
              fieldValidation = checkMinimumLength(fieldValidation, field);
              fieldValidation = checkMaximumLength(fieldValidation, field);
              break;

            case 'number':
              baseType = Yup.number().integer(
                `${field.label} must be a valid number`
              );

              fieldValidation = baseType;
              fieldValidation = checkRequired(fieldValidation, field, baseType);
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
            case 'verifycode':
              baseType = Yup.string().matches(
                /^\d{6}$/,
                `${field.label} must be a 6 digit number`
              );

              fieldValidation = baseType;
              break;
          }
          break;
      }

      if (
        typeof baseType === 'undefined' ||
        typeof fieldValidation === 'undefined'
      ) {
        baseType = Yup.string();
        fieldValidation = baseType;
        fieldValidation = checkRequired(fieldValidation, field, baseType);
        fieldValidation = checkMinimumLength(fieldValidation, field);
        fieldValidation = checkMaximumLength(fieldValidation, field);
      }

      fieldValidation = fieldValidation.default(field.initialValue ?? '');

      return setIn(acc, field.name, fieldValidation);
    }
    return acc;
  }, {});

  const walkSchema = (schema: any) => {
    Object.entries(schema).forEach(([k, v]: [string, any]) => {
      if (
        typeof v === 'object' &&
        v !== null &&
        (v.constructor === Object || v.constructor === Array)
      ) {
        walkSchema(v);
        // Using object for arrays means that each key in the array can have a different schema (unlikely but not something we're protecting against elsewhere)
        // A side effect is that you'll get objects instead of arrays out of Formik.
        schema[k] = Yup.object(v);
      }
    });
  };

  walkSchema(validationSchema);

  return Yup.object(validationSchema);
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
 * Checks to see if the field is required, if it's a conditional display will check if visible first.
 * This will ensure that hidden fields do not interrupt validation, allowing the user to progress forms
 * @param fieldValidationSchema - The validation schema (when the condition has been met)
 * @param field - The field which we are validating against
 * @param baseType - The base validation schema (for the current type), this will be used always (in the case where the conditions are not met)
 * @param {string} errorMessage - An optional error message, otherwise a default will be used
 * @returns Up to date validation schema with conditional logic (if relevant)
 */
function checkRequired(
  fieldValidationSchema: Yup.BaseSchema,
  field: FormField,
  baseType: Yup.BaseSchema,
  errorMessage?: string
): Yup.BaseSchema {
  errorMessage = errorMessage || `${field.label} is required`;
  if (!field.conditionalDisplay) {
    fieldValidationSchema = field.validation?.required
      ? fieldValidationSchema.required(errorMessage)
      : fieldValidationSchema;
  }
  if (field.conditionalDisplay && field.validation?.required) {
    const conditionalLogicFields: string[] = field.conditionalDisplay.map(
      (condition) => condition.field
    );

    fieldValidationSchema = baseType.when(conditionalLogicFields, {
      is: (...values: any[]) => {
        let isVisible = true;
        field.conditionalDisplay?.map((condition, index) => {
          if (isVisible && condition.is && condition.is != values[index]) {
            isVisible = false;
          }

          if (
            isVisible &&
            condition.isNot &&
            condition.isNot == values[index]
          ) {
            isVisible = false;
          }
        });
        return isVisible;
      },
      then: fieldValidationSchema.required(errorMessage),
      otherwise: fieldValidationSchema,
    });
  }

  return fieldValidationSchema;
}
