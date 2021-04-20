export type FormField = {
  as?: string
  hint?: string
  initialValue?: boolean | number | string
  label: string
  name: string
  options?: FormOption[]
  placeholder?: string
  type?: string
  value?: string
}

export type FormOption = {
  hint?: string
  label?: string
  value: string
}

export type FormSection = {
  active: boolean
  fields: FormField[]
  id: string
  legend: string
}

export type MultiPageFormData = {
  sections: FormSection[]
  title: string | undefined
}