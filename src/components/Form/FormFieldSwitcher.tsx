import Checkboxes from "../Checkboxes/Checkboxes"
import Input from "../Input/Input"
import Select from "../Select/Select"
import Textarea from "../Textarea/Textarea"
import { FormField } from "../../types/form-types"

interface FormFieldSwitcherProps {
  field: FormField
}

const FormFieldSwitcher = ({ field }: FormFieldSwitcherProps): JSX.Element => {
  switch(field.type.toLowerCase()) {
    case "checkbox":
    case "checkboxes":
      return <Checkboxes field={field} />

    case "select":
      return <Select field={field} />

    case "textarea":
      return <Textarea field={field} />

    default:
      return <Input field={field} />
  }
}

export default FormFieldSwitcher