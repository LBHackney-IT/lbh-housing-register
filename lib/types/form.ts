export type EligibilityCriteria = {
  field: string;
  is?: string;
  isNot?: string;
  reasoning?: string;
};

export type FormData = {
  [key: string]: any;
};

export type FormField = {
  as?: string;
  conditionalDisplay?: FormFieldDisplayCriteria[];
  hint?: string;
  initialValue?: boolean | number | string | string[];
  label: string;
  name: string;
  options?: FormFieldOption[];
  placeholder?: string;
  type?: string;
  validation?: FormFieldValidation;
};

export type FormFieldDisplayCriteria = {
  field: string;
  is?: boolean | number | string;
  isNot?: boolean | number | string;
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
  nextFormId: string;
};

export type MultiStepForm = {
  copy?: string;
  eligibility?: EligibilityCriteria[];
  heading?: string;
  steps: FormStep[];
  conditionals: Conditionals[];
};
