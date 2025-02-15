import { FormikValues } from 'formik';
import { FormID } from '../utils/form-data';
import { DisqualificationReason } from '../utils/disqualificationReasonOptions';

// @Deprecated
export type FormData = FormikValues;

export type EligibilityCriteria = {
  field: string;
  is?: string;
  isNot?: string;
  reasoning: DisqualificationReason;
};

export interface BaseFormField {
  name: string;
  label: string;
  hint?: string;
  details?: DetailsSection;
  conditionalDisplay?: FormFieldDisplayCriteria[];
  validation?: FormFieldValidation;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
  hideLabel?: boolean;
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
  modifierClasses?: string;
  options: FormFieldOption[];
}

export interface DateFormField extends BaseFormField {
  as: 'dateinput';
}

export interface ParagraphFormField extends BaseFormField {
  as: 'paragraph';
}
export interface AnnouncementTextFormField extends BaseFormField {
  as: 'announcement';
  title?: string;
  content?: string;
  list?: string[];
  variant: 'info' | 'success' | 'warning';
}

export interface RadioConditionalFormField extends BaseFormField {
  as: 'radioconditional';
  options: ConditionalFormFieldOption[];
}

export interface CheckboxesConditionalFormField extends BaseFormField {
  as: 'checkboxesconditional';
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
  | AnnouncementTextFormField
  | RadioConditionalFormField
  | CheckboxesConditionalFormField;

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
  routeSelect?: boolean;
};

export type MultiStepForm = {
  id: string;
  copy?: string;
  eligibility?: EligibilityCriteria[];
  heading?: string;
  steps: FormStep[];
  conditionals?: Conditionals[];
};

export type DetailsSection = {
  title: string;
  content: string;
};
