import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import "./Checkbox.scss"

interface RadioProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

const Radio = ({ index, hint, label, name, value }: RadioProps): JSX.Element => {
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

export default Radio