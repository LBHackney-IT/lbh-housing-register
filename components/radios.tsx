import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormFieldOption } from "../lib/types/form"
import { Field } from "formik"

interface RadioProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

interface RadiosProps {
  field: FormField
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

export default function Radios({ field }: RadiosProps): JSX.Element {
  const radios = field.options || [field as FormFieldOption]
  const hasMultipleOptions: boolean = radios.length > 1

  return (
    <FormGroup>
      {hasMultipleOptions && field.label && <Label content={field.label} />}
      {hasMultipleOptions && field.hint && <Hint content={field.hint} />}

      <div className="govuk-radios lbh-radios">
        {radios.map((radio, index) => 
          <Radio key={index} index={index} hint={radio.hint} label={radio.label} name={field.name} value={radio.value} />
        )}
      </div>
    </FormGroup>
  )
}