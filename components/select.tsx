import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../lib/types/form"
import { Field } from "formik"

interface SelectProps {
  field: FormField
}

export default function Select({ field }: SelectProps): JSX.Element {
  field.options = field.options || []

  return (
    <FormGroup>
      {field.label && <Label content={field.label} htmlFor={field.name} />}
      {field.hint && <Hint content={field.hint} />}

      <Field as="select" className="govuk-select lbh-select" id={field.name} name={field.name}>
        {field.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Field>
    </FormGroup>
  )
}