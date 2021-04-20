import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormFieldOption } from "../lib/types/form"
import { Field, FieldArray } from "formik"

interface CheckboxProps {
  hint?: string
  index?: number
  label?: string
  name: string
  value: string
}

interface CheckboxesProp {
  field: FormField
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

export default function Checkboxes({ field }: CheckboxesProp): JSX.Element {
  const checkboxes = field.options || [field as FormFieldOption]
  const hasMultipleOptions: boolean = checkboxes.length > 1

  return (
    <FormGroup>
      {hasMultipleOptions && field.label && <Label content={field.label} />}
      {hasMultipleOptions && field.hint && <Hint content={field.hint} />}

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
  )
}