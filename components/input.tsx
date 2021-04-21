import ErrorMessage from "./error-message"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../lib/types/form"
import { Field, FieldInputProps, FieldMetaProps } from "formik"

interface InputProps extends FormField {
  className?: string
}

export default function Input({ className, hint, label, name, placeholder, type }: InputProps): JSX.Element {
  return (
    <Field name={name}>
      {({ field, meta }: { field: FieldInputProps<string>, meta: FieldMetaProps<string> }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {label && <Label content={label} htmlFor={name} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <input
            className={`${className} ${meta.touched && meta.error && "govuk-input--error"} govuk-input lbh-input`}
            id={name}
            placeholder={placeholder}
            type={type}
            {...field} />
        </FormGroup>
      )}
    </Field>
  )
}