import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormOption } from "../lib/types/form"

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

export const Radio = ({ index, hint, label, name, value }: RadioProps): JSX.Element => {
  let id = name

  if (index !== undefined) {
    id += `__${index}`
  }

  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        id={id}
        name={name}
        value={value}
        type="radio"
      />
      <Label className="govuk-radios__label" content={label || value} htmlFor={id} />

      {hint && <Hint className="govuk-radios__hint" content={hint} />}
    </div>
  )
}

const Radios = ({ field }: RadiosProps): JSX.Element => {
  const radios = field.options || [field as FormOption]
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

export default Radios