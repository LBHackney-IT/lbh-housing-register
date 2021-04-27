import Button from "../button"
import DynamicField from "./dynamic-field"
import { HeadingOne, HeadingTwo } from "../headings"
import { FormStep, MultiPageFormData } from "../../lib/types/form"
import { getDisplayStateOfField, getInitialValuesFromMultiPageFormData } from "../../lib/utils/form"
import { buildValidationSchema } from "../../lib/utils/validation"
import { Form as FormikForm, Formik } from "formik"
import { useState } from "react"

interface FormProps {
  formData: MultiPageFormData
  onSubmit: (values: {}, bag: any) => void
}

// TODO: The ability to reset the form (apply/reset or /reset maybe?)

export default function Form({ formData, onSubmit }: FormProps): JSX.Element {
  const [stepNumber, setStepNumber] = useState(0)
  const [snapshot, setSnapshot] = useState(getInitialValuesFromMultiPageFormData(formData))

  const step: FormStep = formData.steps[stepNumber] // TODO: load requested step, if previous steps are valid that is
  const totalSteps: number = formData.steps.length
  const hasMultipleSteps: boolean = totalSteps > 1
  const isLastStep: boolean = stepNumber === totalSteps - 1

  const next = (values: {[key: string]: any}): void => {
    // TODO: Update URL with step
    // TODO: Scroll to top + set focus to first field
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: {[key: string]: any}): void => {
    // TODO: Update URL with step
    // TODO: Scroll to top + set focus to first field
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
        validationSchema={buildValidationSchema(step.fields)}
      >
        {({isSubmitting, values}) => (
          <FormikForm>
            <HeadingTwo content={hasMultipleSteps ? `Step ${stepNumber + 1} of ${totalSteps}: ${step.legend}` : step.legend} />
            {step.fields.map((field, index) => {
                const display: boolean = getDisplayStateOfField(field, values)
                if (display) {
                  return <DynamicField key={index} field={field} />
                }
            })}

            <div className="c-flex lbh-simple-pagination">
              {stepNumber > 0 && (
                <div className="c-flex__1">
                  <Button onClick={() => previous(values)} secondary={true} type="button">
                    Previous
                  </Button>
                </div>
              )}

              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  {isLastStep ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};