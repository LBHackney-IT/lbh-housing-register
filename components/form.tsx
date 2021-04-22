import Button from "./button"
import DynamicField from "./dynamic-field"
import Fieldset from "./fieldset"
import { HeadingOne, HeadingTwo } from "./headings"
import Legend from "./legend"
import FormsManager from "../lib/forms-manager"
import { FormSection, MultiPageFormData } from "../lib/types/form"
import { Form as FormikForm, Formik } from "formik"

interface FormProps {
  section: FormSection
  sectionIndex?: number
  totalSections?: number
}

export default function Form({ section, sectionIndex, totalSections }: FormProps): JSX.Element {
  const initialValues = FormsManager.getInitialValuesFromFields(section.fields)
  const validationSchema = FormsManager.getValidationSchemaFromFields(section.fields)

  let legend: string = section.legend
  if (sectionIndex !== undefined && sectionIndex > 0 && totalSections !== undefined && totalSections > 1) {
    legend = `Step ${sectionIndex} of ${totalSections}: ${legend}`
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => console.log(values)}
    >
      { ({ values }) => (
      <FormikForm>
        <Fieldset>
          {legend && 
            <Legend>
              <HeadingTwo content={legend} />
            </Legend>
          }

          {section.fields.map(((field, index) => {
            const display: boolean = FormsManager.getConditionalDisplayStateOfField(field, values)

            if (display) {
              return <DynamicField key={index} field={field} />
            }
          }))}
        </Fieldset>

        <Button type="submit">
          {sectionIndex == totalSections ?
            "Finish"
            :
            "Save and continue"
          }
        </Button>
      </FormikForm>
      )}
    </Formik>
  )
}

interface MultiPageFormProps {
  formData: MultiPageFormData
}

export function MultiPageForm({ formData }: MultiPageFormProps): JSX.Element {
  const totalSections: number = formData.sections.length;

  return (
    <>
      {formData.title && <HeadingOne content={formData.title} />}

      {formData.sections.map(((section, index) =>
        <Form key={index} section={section} sectionIndex={index + 1} totalSections={totalSections} />
      ))}
    </>
  );
}