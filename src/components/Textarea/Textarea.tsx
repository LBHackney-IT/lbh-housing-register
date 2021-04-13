import FormGroup from "../FormGroup/FormGroup"
import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import { FormField } from "../../types/form-types"
import "./Textarea.scss"

interface TextareaProps {
  field: FormField
}

const Textarea = ({ field }: TextareaProps): JSX.Element => (
  <FormGroup>
    {field.label && <Label content={field.label} htmlFor={field.name} />}
    {field.hint && <Hint content={field.hint} />}

    <textarea
      className="govuk-textarea lbh-textarea"
      id={field.name}
      name={field.name}
      defaultValue={field.value} 
      placeholder={field.placeholder}
      rows={5} />
  </FormGroup>
)

export default Textarea