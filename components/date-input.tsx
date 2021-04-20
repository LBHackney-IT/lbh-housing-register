import Fieldset from "./fieldset"
import Hint from "./hint"
import Input from "./input"
import Legend from "./legend"
import { FormField } from "../lib/types/form"
import { FieldArray } from "formik"

interface DateInputProps {
  field: FormField
}

export default function DateInput({ field }: DateInputProps): JSX.Element {
  const dayField: FormField = {
    label: "Day",
    name: `${field.name}.day`,
    placeholder: "DD",
    type: "number",
  }

  const monthField: FormField = {
    label: "Month",
    name: `${field.name}.month`,
    placeholder: "MM",
    type: "number",
  }

  const yearField: FormField = {
    label: "Year",
    name: `${field.name}.year`,
    placeholder: "YYYY",
    type: "number",
  }

  const fields = [dayField, monthField, yearField]

  return (
    <Fieldset >
      {field.label && <Legend>{field.label}</Legend>}
      {field.hint && <Hint content={field.hint} />}

      <FieldArray
        name={field.name}
        render={() => (
          <>
          {fields.map((field, index) => {
            const className = "govuk-date-input__input govuk-input--width-" + (field.label === "Year" ? "3" : "2")

            return (
              <div key={index} className="govuk-date-input__item">
                <Input className={className} field={field} />
              </div>
            )
          })}
          </>
        )}
      />
    </Fieldset>
  )
}

// TODO
// Maximum day = 31
// Maximum month = 12
// Minimum year = 1900