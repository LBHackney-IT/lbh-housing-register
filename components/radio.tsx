import Hint from "./hint"
import Label from "./label"

interface RadioProps {
  index?: number
  hint?: string
  label?: string
  name: string
  value: string
}

export default function Radio({ index, hint, label, name, value }: RadioProps): JSX.Element {
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