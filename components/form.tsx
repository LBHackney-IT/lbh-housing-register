import Button from "./button"
import DynamicField from "./dynamic-field"
import { HeadingOne, HeadingTwo } from "./headings"
import FormsManager from "../lib/forms-manager"
import { FormStep, MultiPageFormData } from "../lib/types/form"
import { Form as FormikForm, Formik } from "formik"
import { useState } from "react"

interface FormProps {
  formData: MultiPageFormData
  onSubmit: (values: {}, bag: any) => void
}

// TODO: The ability to reset the form (apply/reset maybe?)

export default function Form({ formData, onSubmit }: FormProps): JSX.Element {
  const [stepNumber, setStepNumber] = useState(0)
  const [snapshot, setSnapshot] = useState(FormsManager.getInitialValuesFromMultiPageFormData(formData))

  const step = formData.steps[stepNumber] // TODO: load requested step, if previous steps are valid that is
  const totalSteps = formData.steps.length
  const hasMultipleSteps = totalSteps > 1
  const isLastStep = stepNumber === totalSteps - 1

  const next = (values: {[key: string]: any}): void => {
    // TODO: Update URL with step
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: {[key: string]: any}): void => {
    // TODO: Update URL with step
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: {[key: string]: any}, bag: any) => {
    // TODO: Save users' data
    // TODO: Validate current step (still eligible?)
    // - boot process if not eligible, ?reason=...

    if (isLastStep) {
      return onSubmit(values, bag);
    }
    else {
      bag.setTouched({});
      next(values);
    }
  };

  return (
    <>
      {formData.title && <HeadingOne content={formData.title} />}

      <Formik
        initialValues={snapshot}
        onSubmit={handleSubmit}
        validationSchema={FormsManager.getValidationSchemaFromFields(step.fields)}
      >
        {({isSubmitting, values}) => (
          <FormikForm>
            <HeadingTwo content={hasMultipleSteps ? `Step ${stepNumber + 1} of ${totalSteps}: ${step.legend}` : step.legend} />
            {step.fields.map((field, index) => {
                const display: boolean = FormsManager.getConditionalDisplayStateOfField(field, values)
                if (display) {
                  return <DynamicField key={index} field={field} />
                }
            })}

            <div style={{ display: 'flex' }}>
              {stepNumber > 0 && (
                <button onClick={() => previous(values)} type="button">
                  Back
                </button>
              )}
              <div>
                <button disabled={isSubmitting} type="submit">
                  {isLastStep ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};