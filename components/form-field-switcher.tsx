import Checkboxes from "./checkboxes"
import DateInput from "./date-input"
import Input from "./input"
import Radios from "./radios"
import Select from "./select"
import Textarea from "./textarea"
import { FormField } from "../lib/types/form"

interface FormFieldSwitcherProps {
  field: FormField
}

export default function FormFieldSwitcher({ field }: FormFieldSwitcherProps): JSX.Element {
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