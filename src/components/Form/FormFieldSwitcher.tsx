import Checkboxes from "../Checkboxes/Checkboxes"
import DateInput from "../DateInput/DateInput"
import Input from "../Input/Input"
import Radios from "../Radios/Radios"
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

    case "date":
    case "datetime":
      return <DateInput field={field} />

    case "radio":
      return <Radios field={field} />

    case "select":
      return <Select field={field} />

    case "textarea":
      return <Textarea field={field} />

    default:
      return <Input field={field} />
  }
}

export default FormFieldSwitcher