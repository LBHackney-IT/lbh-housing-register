import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import "./Radio.scss"

interface CheckboxProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

const Checkbox = ({ index, hint, label, name, value }: CheckboxProps): JSX.Element => {
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

export default Checkbox