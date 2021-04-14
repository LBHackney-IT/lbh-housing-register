import Fieldset from "../Fieldset/Fieldset"
import Hint from "../Hint/Hint"
import Input from "../Input/Input"
import { FormField } from "../../types/form-types"
import "./DateInput.scss"
import Legend from "../Legend/Legend"

interface DateInputProps {
  field: FormField
}

const DateInput = ({ field }: DateInputProps): JSX.Element => {
  const dayField: FormField = {
    label: "Day",
    name: `${field.name}__day`,
    type: "number",
  }

  const monthField: FormField = {
    label: "Month",
    name: `${field.name}__month`,
    type: "number",
  }

  const yearField: FormField = {
    label: "Year",
    name: `${field.name}__year`,
    type: "number",
  }

  const fields = [dayField, monthField, yearField]

  return (
    <Fieldset >
      {field.label && <Legend>{field.label}</Legend>}
      {field.hint && <Hint content={field.hint} />}

      {fields.map((field, index) => {
        const className = "govuk-date-input__input govuk-input--width-" + (field.label === "Year" ? "4" : "2")

        return (
          <div key={index} className="govuk-date-input__item">
            <Input className={className} field={field} />
          </div>
        )
      })}
    </Fieldset>
  )
}

export default DateInput

// TODO
// Maximum day = 31
// Maximum month = 12
// Minimum year = 1900