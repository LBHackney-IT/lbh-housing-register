import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormOption } from "../lib/types/form"

interface CheckboxProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

interface CheckboxesProp {
  field: FormField
}

export const Checkbox = ({ index, hint, label, name, value }: CheckboxProps): JSX.Element => {
  let id = name
  
  if (index !== undefined) {
    id += `__${index}`
  }

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={id}
        name={name}
        value={value}
        type="checkbox"
      />
      <Label className="govuk-checkboxes__label" content={label || value} htmlFor={id} />

      {hint && <Hint className="govuk-checkboxes__hint" content={hint} />}
    </div>
  )
}

const Checkboxes = ({ field }: CheckboxesProp): JSX.Element => {
  const checkboxes = field.options || [field as FormOption]
  const hasMultipleOptions: boolean = checkboxes.length > 1

  return (
    <FormGroup>
      {hasMultipleOptions && field.label && <Label content={field.label} />}
      {hasMultipleOptions && field.hint && <Hint content={field.hint} />}

      <div className="govuk-checkboxes lbh-checkboxes">
        {checkboxes.map((checkbox, index) => 
          <Checkbox key={index} index={index} hint={checkbox.hint} label={checkbox.label} name={field.name} value={checkbox.value} />
        )}
      </div>
    </FormGroup>
  )
}

export default Checkboxes