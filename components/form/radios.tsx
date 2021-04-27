import ErrorMessage from "./error-message"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormFieldOption } from "../../lib/types/form"
import { Field, FieldInputProps, FieldMetaProps } from "formik"

interface RadioProps extends FormField {
  index?: number
  value: string
}

export function Radio({ index, hint, label, name, value }: RadioProps): JSX.Element {
  let id = name

  if (index !== undefined) {
    id += `.${index}`
  }

  return (
    <div className="govuk-radios__item">
      <Field
        className="govuk-radios__input"
        type="radio"
        id={id}
        name={name}
        value={value}
      />
      <Label className="govuk-radios__label" content={label || value} htmlFor={id} />

      {hint && <Hint className="govuk-radios__hint" content={hint} />}
    </div>
  )
}

export interface RadiosProps extends FormField {
  value: string
}

export default function Radios({ hint, label, name, options }: RadiosProps): JSX.Element {
  return (
    <Field name={name}>
      {({ field, meta }: { field: FieldInputProps<string>, meta: FieldMetaProps<string> }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {label && <Label content={label} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <div className="govuk-radios lbh-radios">
            {options?.map((radio, index) => 
              <Radio key={index} index={index} hint={radio.hint} label={radio.label!} name={field.name} value={radio.value} />
            )}
          </div>
        </FormGroup>
      )}
    </Field>
  )
}