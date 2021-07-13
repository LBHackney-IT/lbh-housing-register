import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { FormData, MultiStepForm } from '../../lib/types/form';
import {
    getDisplayStateOfField,
    getInitialValuesFromMultiStepForm
} from '../../lib/utils/form';
import { buildValidationSchema } from '../../lib/utils/validation';
import Button from '../button';
import { HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import DynamicField from './dynamic-field';

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
  const calculatedInitialValues = useMemo(
    () => initialValues || getInitialValuesFromMultiStepForm(formData),
    [initialValues, formData]
  );
  const [stepNumber, setStepNumber] = useState(0);

  const step = formData.steps[stepNumber];
  const totalSteps = formData.steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const submitButtonRef = useRef<'submit' | 'submitExit'>();

  const next = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: FormData, bag: any) => {
    // TODO Do we need on save and on submit?
    if (onSave) {
      onSave && onSave(values);
    }

    if (isLastStep) {
      if (onSubmit) {
        onSubmit(values, bag);
      }

      if (onExit && submitButtonRef.current === 'submitExit') {
        onExit();
      }
    } else if (onExit && submitButtonRef.current === 'submitExit') {
      onExit();
    } else {
      bag.setTouched({});
      next();
    }
  };

  return (
    <>
      <Formik
        // If you notice that initial values aren't working then it's probably because of the way that _app is loading state incrementally through multiple renders.
        // A loading screen that waited for initial state to be avaialble would do the trick.
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
                    handleChange={handleChange} // todo what's this for?
                  />
                );
              }
            })}

            <div className="c-flex lbh-simple-pagination">
              {stepNumber > 0 && (
                <div className="c-flex__1">
                  <Button
                    onClick={() => previous()}
                    secondary={true}
                    type="button"
                  >
                    Previous step
                  </Button>
                </div>
              )}

              <div className="c-flex__1 text-right">
                <Button
                  onClick={() => {
                    submitButtonRef.current = 'submit';
                  }}
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
                  onClick={() => {
                    submitButtonRef.current = 'submitExit';
                  }}
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
