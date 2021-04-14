import Hint from "./hint"
import Label from "./label"

interface RadioProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

const Checkbox = ({ index, hint, label, name, value }: RadioProps): JSX.Element => {
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

export default Checkbox