import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../lib/types/form"
import { Field } from "formik"

interface InputProps {
  className?: string
  field: FormField
}

export default function Input({ className, field }: InputProps): JSX.Element {
  return (
    <FormGroup>
      {field.label && <Label content={field.label} htmlFor={field.name} />}
      {field.hint && <Hint content={field.hint} />}

      <Field
        className={`${className} govuk-input lbh-input`}
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        type={field.type}
      />
    </FormGroup>
  )
}