import { FormikValues } from 'formik';
import { FormID } from '../utils/form-data';

// @Deprecated
export type FormData = FormikValues;

export type EligibilityCriteria = {
  field: string;
  is?: string;
  isNot?: string;
  reasoning?: string;
};

export interface BaseFormField {
  name: string;
  label: string;
  hint?: string;
  details?: string;
  conditionalDisplay?: FormFieldDisplayCriteria[];
  validation?: FormFieldValidation;
  placeholder?: string;
  initialValue?: any;
}

export interface TextFormField extends BaseFormField {
  as?: undefined;
  type?: string;
}
export interface TextareaFormField extends BaseFormField {
  as: 'textarea';
}
export interface CheckboxFormField extends BaseFormField {
  as: 'checkbox';
}
export interface CheckboxesFormField extends BaseFormField {
  as: 'checkboxes';
  options: FormFieldOption[];
}
export interface RadioFormField extends BaseFormField {
  as: 'radios';
  options: FormFieldOption[];
}

export interface SelectFormField extends BaseFormField {
  as: 'select';
  options: FormFieldOption[];
}

export interface DateFormField extends BaseFormField {
  as: 'dateinput';
}

export interface ParagraphFormField extends BaseFormField {
  as: 'paragraph';
}
export interface InsetTextFormField extends BaseFormField {
  as: 'insettext';
  title?: string;
  content?: string;
  list?: string[];
}

export interface RadioConditionalFormField extends BaseFormField {
  as: 'radioconditional';
  options: ConditionalFormFieldOption[];
}

export type FormField =
  | TextFormField
  | TextareaFormField
  | RadioFormField
  | CheckboxFormField
  | CheckboxesFormField
  | SelectFormField
  | DateFormField
  | ParagraphFormField
  | InsetTextFormField
  | RadioConditionalFormField;

export type FormFieldDisplayCriteria = {
  field: string;
  is?: boolean | number | string;
  isNot?: boolean | number | string;
};

export type ConditionalFormFieldOption = {
  hint?: string;
  label?: string;
  value: string;
  conditionalFieldInput?: ConditionalFormFieldOptionInput;
};

export type ConditionalFormFieldOptionInput = {
  as?: string;
  containerId?: string;
  fieldId?: string;
  fieldName?: string;
  label?: string;
  display: boolean;
};

export type FormFieldOption = {
  hint?: string;
  label?: string;
  value: string;
};

export type FormFieldValidation = {
  required?: boolean;
  min?: number | string;
  max?: number | string;
};

export type FormStep = {
  copy?: string;
  fields: FormField[];
  heading?: string;
  subheading?: string;
};

export type Conditionals = {
  fieldId: string;
  value: string;
  nextFormId: FormID | 'exit';
};

export type MultiStepForm = {
  copy?: string;
  eligibility?: EligibilityCriteria[];
  heading?: string;
  steps: FormStep[];
  conditionals?: Conditionals[];
};
