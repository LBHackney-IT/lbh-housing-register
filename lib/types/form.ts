export type FormField = {
  as?: string
  conditionalDisplay?: FormFieldDisplayCriteria[]
  hint?: string
  initialValue?: boolean | number | string
  label: string
  name: string
  options?: FormFieldOption[]
  placeholder?: string
  type?: string
  validation?: FormFieldValidation
  value?: string
}

export type FormFieldDisplayCriteria = {
  field: string
  is?: boolean | number | string
  isNot?: boolean | number | string
}

export type FormFieldOption = {
  hint?: string
  label?: string
  value: string
}

export type FormFieldValidation = {
  required?: boolean
  min?: number
  max?: number
}

export type FormSection = {
  fields: FormField[]
  id: string
  legend: string
}

export type MultiPageFormData = {
  sections: FormSection[]
  title: string | undefined
}