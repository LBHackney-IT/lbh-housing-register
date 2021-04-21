import Checkboxes from "./checkboxes"
import Input from "./input"
import Radios from "./radios"
import Select from "./select"
import Textarea from "./textarea"
import { FormField } from "../lib/types/form"

interface DynamicFieldProps {
  field: FormField
}

export default function DynamicField({ field }: DynamicFieldProps): JSX.Element {
  switch(field.as?.toLowerCase()) {
    case "checkbox":
    case "checkboxes":
      return <Checkboxes {...field} />
    
    case "radios":
      return <Radios {...field} />

    case "select":
      return <Select {...field} />

    case "textarea":
      return <Textarea field={field} />

    default:
      return <Input {...field} />
  }
}