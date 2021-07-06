import Button from '../button';
import DynamicField from './dynamic-field';
import { HeadingTwo } from '../content/headings';
import { FormData, FormStep, MultiStepForm } from '../../lib/types/form';
import {
  getDisplayStateOfField,
  getInitialValuesFromMultiStepForm,
} from '../../lib/utils/form';
import { buildValidationSchema } from '../../lib/utils/validation';
import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { useMemo, useState } from 'react';
import Paragraph from '../content/paragraph';

interface FormProps {
  buttonText?: string;
  formData: MultiStepForm;
  onExit?: () => void;
  onSave?: (values: FormData) => void;
  onSubmit?: (values: FormData, bag: any) => void;
  initialValues?: FormikValues;
  onAddressLookup?: any;
  timeAtAddress?: any;
  disableSubmit?: boolean;
}

export default function Form({
  buttonText,
  formData,
  onExit,
  onSave,
  onSubmit,
  initialValues,
  onAddressLookup,
  timeAtAddress,
  disableSubmit,
}: FormProps): JSX.Element {
  // TODO shouldn't initialValues be dependent on the step?
  const calculatedInitialValues = useMemo(
    () => initialValues || getInitialValuesFromMultiStepForm(formData),
    [initialValues, formData]
  );
  const [stepNumber, setStepNumber] = useState(0);

  const step = formData.steps[stepNumber];
  const totalSteps = formData.steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: FormData, bag: any) => {
    if (onSave) {
      onSave && onSave(values);
    }

    if (isLastStep) {
      if (onSubmit) {
        onSubmit(values, bag);
      }

      if (exit && onExit) {
        onExit();
      }
    } else if (exit && onExit) {
      onExit();
    } else {
      bag.setTouched({});
      next();
    }
  };

  return (
    <>
      <Formik
        initialValues={calculatedInitialValues}
        onSubmit={handleSubmit}
        validationSchema={buildValidationSchema(step.fields)}
      >
        {({ isSubmitting, values, handleChange }) => (
          <FormikForm>
            {step.heading && <HeadingTwo content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}

            {step.fields.map((field, index) => {
              const display: boolean = getDisplayStateOfField(field, values);
              if (display) {
                return (
                  <DynamicField
                    key={index}
                    field={field}
                    onAddressLookup={onAddressLookup}
                    timeAtAddress={timeAtAddress}
                    handleChange={handleChange}
                  />
                );
              }
            })}

            <div className="c-flex lbh-simple-pagination">
              {stepNumber > 0 && (
                <div className="c-flex__1">
                  <Button
                    onClick={() => previous(values)}
                    secondary={true}
                    type="button"
                  >
                    Previous step
                  </Button>
                </div>
              )}

              <div className="c-flex__1 text-right">
                <Button
                  onClick={() => (exit = false)}
                  disabled={disableSubmit}
                  type="submit"
                >
                  {buttonText ? buttonText : 'Save'}
                </Button>
              </div>
            </div>

            {onExit && (
              <div className="text-right">
                <Button
                  onClick={() => (exit = true)}
                  disabled={isSubmitting || isSubmitting}
                  type="submit"
                  secondary={true}
                >
                  Save and exit
                </Button>
              </div>
            )}
          </FormikForm>
        )}
      </Formik>
    </>
  );
}
