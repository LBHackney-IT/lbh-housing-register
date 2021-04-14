import Checkbox from "./checkbox"
import FormGroup from "./form-group"
import Hint from "./hint"
import Label from "./label"
import { FormField, FormOption } from "../lib/types/form"

interface CheckboxesProp {
  field: FormField
}

const Checkboxes = ({ field }: CheckboxesProp): JSX.Element => {
  const checkboxes = field.options || [field as FormOption]
  const hasMultipleOptions: boolean = checkboxes.length > 1

  return (
    <FormGroup>
      {hasMultipleOptions && field.label && <Label content={field.label} />}
      {hasMultipleOptions && field.hint && <Hint content={field.hint} />}

      <div className="govuk-checkboxes lbh-checkboxes">
        {checkboxes.map((checkbox, index) => 
          <Checkbox key={index} index={index} hint={checkbox.hint} label={checkbox.label} name={field.name} value={checkbox.value} />
        )}
      </div>
    </FormGroup>
  )
}

export default Checkboxes