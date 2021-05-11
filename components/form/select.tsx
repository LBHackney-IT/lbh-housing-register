import ErrorMessage from "./error-message"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../../lib/types/form"
import { Field, FieldInputProps, FieldMetaProps } from "formik"

interface SelectProps extends FormField {
}

export default function Select({ focus, hint, label, name, options }: SelectProps): JSX.Element {
  return (
    <Field name={name}>
      {({ field, meta }: { field: FieldInputProps<string>, meta: FieldMetaProps<string> }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {label && <Label content={label} htmlFor={field.name} strong={true} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <select autoFocus={focus} className={`${!!meta.touched && !!meta.error ? "govuk-select--error" : ""} govuk-select lbh-select`} id={field.name} {...field}>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        </FormGroup>
      )}
    </Field>
  )
}