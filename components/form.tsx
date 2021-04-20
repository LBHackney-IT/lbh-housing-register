import Button from "./button"
import DynamicField from "./dynamic-field"
import Fieldset from "./fieldset"
import { HeadingTwo } from "./headings"
import Legend from "./legend"
import { FormSection } from "../lib/types/form"
import { Form as FormikForm, Formik } from "formik";

interface FormProps {
  section: FormSection
  sectionIndex?: number
  totalSections?: number
}

export default function Form({ section, sectionIndex, totalSections }: FormProps): JSX.Element {
  const initialValues: { [key: string]: boolean | number | object | string } = {};
  section.fields.map(field => initialValues[field.name] = field.initialValue || "")

  let legend: string = section.legend
  if (sectionIndex !== undefined && sectionIndex > 0 && totalSections !== undefined && totalSections > 1) {
    legend = `Step ${sectionIndex} of ${totalSections}: ${legend}`
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => console.log(values)}
    >
      <FormikForm>
        <Fieldset>
          {legend && 
            <Legend>
              <HeadingTwo content={legend} />
            </Legend>
          }

          {section.fields.map(((field, index) =>
            <DynamicField key={index} field={field} />
          ))}
        </Fieldset>

        <Button type="submit">
          Save and continue
        </Button>
      </FormikForm>
    </Formik>
  )
}