import FormGroup from "../FormGroup/FormGroup"
import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import { FormField } from "../../types/form-types"
import "./Input.scss"

interface InputProps {
  className?: string
  field: FormField
}

const Input = ({ className, field }: InputProps): JSX.Element => (
  <FormGroup>
    {field.label && <Label content={field.label} htmlFor={field.name} />}
    {field.hint && <Hint content={field.hint} />}

    <input
      className={`${className} govuk-input lbh-input`}
      id={field.name}
      name={field.name}
      defaultValue={field.value}
      placeholder={field.placeholder}
      type={field.type}
    />
  </FormGroup>
)

export default Input