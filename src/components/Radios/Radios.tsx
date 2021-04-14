import FormGroup from "../FormGroup/FormGroup"
import Hint from "../Hint/Hint"
import Label from "../Label/Label"
import Radio from "./Radio"
import { FormField, FormOption } from "../../types/form-types"

interface RadiosProps {
  field: FormField
}

const Radios = ({ field }: RadiosProps): JSX.Element => {
  const radios = field.options || [field as FormOption]
  const hasMultipleOptions: boolean = radios.length > 1

  return (
    <FormGroup>
      {hasMultipleOptions && field.label && <Label content={field.label} />}
      {hasMultipleOptions && field.hint && <Hint content={field.hint} />}

      <div className="govuk-radios lbh-radios">
        {radios.map((radio, index) => 
          <Radio key={index} index={index} hint={radio.hint} label={radio.label} name={field.name} value={radio.value} />
        )}
      </div>
    </FormGroup>
  )
}

export default Radios