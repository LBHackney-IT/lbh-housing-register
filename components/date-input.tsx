import Fieldset from "./fieldset"
import Hint from "./hint"
import Input from "./input"
import Legend from "./legend"
import { FormField } from "../lib/types/form"

interface DateInputProps {
  field: FormField
}

export default function DateInput({ field }: DateInputProps): JSX.Element {
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

// TODO
// Maximum day = 31
// Maximum month = 12
// Minimum year = 1900