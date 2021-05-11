import ErrorMessage from "./error-message"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../../lib/types/form"
import { Field, FieldInputProps, FieldMetaProps } from "formik"

interface TextareaProps extends FormField {
}

export default function Textarea({ focus, hint, label, name, placeholder }: TextareaProps): JSX.Element {
  return (
    <Field name={name}>
      {({ field, meta }: { field: FieldInputProps<string>, meta: FieldMetaProps<string> }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {label && <Label content={label} htmlFor={field.name} strong={true} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <textarea
            autoFocus={focus}
            className={`${!!meta.touched && !!meta.error ? "govuk-textarea--error" : ""} govuk-textarea lbh-textarea`}
            id={field.name}
            placeholder={placeholder}
            rows={5}
            {...field} />
        </FormGroup>
      )}
    </Field>
  )
}