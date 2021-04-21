import ErrorMessage from "./error-message"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormFieldOption } from "../lib/types/form"
import { Field, FieldArray, FieldInputProps, FieldMetaProps } from "formik"

interface CheckboxProps {
  hint?: string
  index?: number
  label?: string
  name: string
  value: string
}

export function Checkbox({ hint, index, label, name, value }: CheckboxProps): JSX.Element {
  let id = name

  if (index) {
    id += `.${index}`
  }

  return (
    <div className="govuk-checkboxes__item">
      <Field
        className="govuk-checkboxes__input"
        type="checkbox"
        id={id}
        name={name}
        value={value}
      />
      <Label className="govuk-checkboxes__label" content={label || value} htmlFor={id} />

      {hint && <Hint className="govuk-checkboxes__hint" content={hint} />}
    </div>
  )
}


interface CheckboxesProp extends FormField {
}

export default function Checkboxes({ hint, label, options, name, value }: CheckboxesProp): JSX.Element {
  const checkboxes: FormFieldOption[] = options || [{ hint, label, value: value! }]
  const hasMultipleOptions: boolean = checkboxes.length > 1

  return (
    <Field name={name}>
      {({ field, meta }: { field: FieldInputProps<string>, meta: FieldMetaProps<string> }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {hasMultipleOptions && label && <Label content={label} />}
          {hasMultipleOptions && hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <div className="govuk-checkboxes lbh-checkboxes" role="group" aria-labelledby="checkbox-group">
            <FieldArray
              name={field.name}
              render={() => (
                <>
                  {checkboxes.map((checkbox, index) => (
                    <Checkbox key={index} index={index} hint={checkbox.hint} label={checkbox.label} name={field.name} value={checkbox.value} />
                  ))}
                </>
              )}
            />
          </div>
        </FormGroup>
      )}
    </Field>
  )
}