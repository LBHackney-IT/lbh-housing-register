import FormGroup from "../FormGroup/FormGroup"
import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import { FormField } from "../../types/form-types"
import "./Select.scss"

interface SelectProps {
  field: FormField
}

const Select = ({ field }: SelectProps): JSX.Element => {
  field.options = field.options || []

  return (
    <FormGroup>
      {field.label && <Label content={field.label} htmlFor={field.name} />}
      {field.hint && <Hint content={field.hint} />}

      <select className="govuk-select lbh-select" id={field.name} name={field.name} defaultValue={field.value}>
        {field.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    </FormGroup>
  )
}

export default Select