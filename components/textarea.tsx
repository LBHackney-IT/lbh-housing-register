import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField } from "../lib/types/form"
import { Field } from "formik"

interface TextareaProps {
  field: FormField
}

export default function Textarea({ field }: TextareaProps): JSX.Element {
  return (
    <FormGroup>
      {field.label && <Label content={field.label} htmlFor={field.name} />}
      {field.hint && <Hint content={field.hint} />}

      <Field
        as="textarea"
        className="govuk-textarea lbh-textarea"
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        rows={5} />
    </FormGroup>
  )
}