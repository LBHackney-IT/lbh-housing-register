import Button from "../button"
import DynamicField from "./dynamic-field"
import { HeadingOne } from "../content/headings"
import { FormStep, MultiPageFormData } from "../../lib/types/form"
import { getDisplayStateOfField, getInitialValuesFromMultiPageFormData } from "../../lib/utils/form"
import { buildValidationSchema } from "../../lib/utils/validation"
import { Form as FormikForm, Formik } from "formik"
import { useState } from "react"
import Paragraph from "../content/paragraph"

interface FormProps {
  formData: MultiPageFormData
  onSave?: (values: {}) => void
  onSubmit: (values: {}, bag: any) => void
}

export default function Form({ formData, onSave, onSubmit }: FormProps): JSX.Element {
  const [formDataSnapshot] = useState(formData)
  const [stepNumber, setStepNumber] = useState(0)
  const [snapshot, setSnapshot] = useState(getInitialValuesFromMultiPageFormData(formDataSnapshot))

  const step: FormStep = formDataSnapshot.steps[stepNumber]
  const totalSteps: number = formDataSnapshot.steps.length
  const isLastStep: boolean = stepNumber === totalSteps - 1

  const next = (values: {[key: string]: any}): void => {
    // TODO: Scroll to top + set focus to first field
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: {[key: string]: any}): void => {
    // TODO: Scroll to top + set focus to first field
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: {[key: string]: any}, bag: any) => {
    if (onSave) {
      onSave(values);
    }

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
      <Formik
        initialValues={snapshot}
        onSubmit={handleSubmit}
        validationSchema={buildValidationSchema(step.fields)}
      >
        {({ isSubmitting, values }) => (
          <FormikForm>
            {step.heading && <HeadingOne content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}
            
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
                    Previous step
                  </Button>
                </div>
              )}

              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  Save and continue
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};