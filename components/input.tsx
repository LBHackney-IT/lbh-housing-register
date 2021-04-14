import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../lib/types/form"

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