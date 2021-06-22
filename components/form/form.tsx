import Button from '../button';
import DynamicField from './dynamic-field';
import { HeadingTwo } from '../content/headings';
import { FormData, FormStep, MultiStepForm } from '../../lib/types/form';
import {
  getDisplayStateOfField,
  getInitialValuesFromMultiStepForm,
} from '../../lib/utils/form';
import { buildValidationSchema } from '../../lib/utils/validation';
import { Form as FormikForm, Formik } from 'formik';
import { useState } from 'react';
import Paragraph from '../content/paragraph';

interface FormProps {
  buttonText?: string;
  formData: MultiStepForm;
  onExit?: () => void;
  onSave?: (values: FormData) => void;
  onSubmit: (values: FormData, bag: any) => void;
  residentsPreviousAnswers?: FormData;
  onAddressLookup?: any;
  timeAtAdress?: any;
}

export default function Form({
  buttonText,
  formData,
  onExit,
  onSave,
  onSubmit,
  residentsPreviousAnswers,
  onAddressLookup,
  timeAtAdress,
}: FormProps): JSX.Element {
  const [formDataSnapshot] = useState(formData);
  const [stepNumber, setStepNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(
    residentsPreviousAnswers ??
      getInitialValuesFromMultiStepForm(formDataSnapshot)
  );

  let exit = false;
  const step: FormStep = formDataSnapshot.steps[stepNumber];
  const totalSteps: number = formDataSnapshot.steps.length;
  const isLastStep: boolean = stepNumber === totalSteps - 1;

  const next = (values: FormData): void => {
    // TODO: Scroll to top + set focus to first field
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: FormData): void => {
    // TODO: Scroll to top + set focus to first field
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: FormData, bag: any) => {
    console.log('what is values bruh', values)
    if (onSave) {
      onSave(values);
    }

    if (isLastStep) {
      onSubmit(values, bag);

      if (exit && onExit) {
        onExit();
      }
    } else if (exit && onExit) {
      onExit();
    } else {
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
            {step.heading && <HeadingTwo content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}

              {step.fields.map((field, index) => {
                const display: boolean = getDisplayStateOfField(field, values);
                if (display) {
                  return <DynamicField key={index} field={field} onAddressLookup={onAddressLookup} timeAtAdress={timeAtAdress}/>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
