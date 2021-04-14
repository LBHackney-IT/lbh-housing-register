import Fieldset from "../Fieldset/Fieldset"
import FormFieldSwitcher from "./FormFieldSwitcher"
import Legend from "../Legend/Legend"
import { FormSection } from "../../types/form-types"
import HeadingTwo from "../Typography/HeadingTwo"

interface FormProps {
  section: FormSection
  sectionIndex?: number
  totalSections?: number
}

const Form = ({ section, sectionIndex, totalSections }: FormProps): JSX.Element => {
  let legend: string = section.legend

  if (sectionIndex !== undefined && sectionIndex > 0 && totalSections !== undefined && totalSections > 1) {
    legend = `Step ${sectionIndex} of ${totalSections}: ${legend}`
  }

  return (
    <form method="post">
      <Fieldset>
        {legend && 
          <Legend>
            <HeadingTwo content={legend} />
          </Legend>
        }

        {section.fields.map(((field, index) =>
            <FormFieldSwitcher key={index} field={field} />
        ))}
      </Fieldset>

      submit / next step // TODO
    </form>
  )
}

export default Form