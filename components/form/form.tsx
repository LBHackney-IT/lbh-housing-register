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
import Announcement from '../../components/announcement';


interface FormProps {
  buttonText?: string;
  formData: MultiStepForm;
  onExit?: () => void;
  onSave?: (values: FormData) => void;
  onSubmit: (values: FormData, bag: any) => void;
  residentsPreviousAnswers?: FormData;
  onAddressLookup?: any;
  timeAtAddress?: any;
  activeStep: string;
}

export default function Form({
  buttonText,
  formData,
  onExit,
  onSave,
  onSubmit,
  residentsPreviousAnswers,
  onAddressLookup,
  timeAtAddress,
  activeStep,
}: FormProps): JSX.Element {
  console.log('what is formData', formData)
  const [formDataSnapshot] = useState(formData);
  const [stepNumber, setStepNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(
    residentsPreviousAnswers ??
      getInitialValuesFromMultiStepForm(formDataSnapshot)
  );

  let exit = false;
  let step: FormStep = formDataSnapshot.steps[stepNumber];
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
        {({ isSubmitting, values, handleChange }) => (
          <FormikForm>
            {step.heading && <HeadingTwo content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}

              {step.fields.map((field, index) => {
                const display: boolean = getDisplayStateOfField(field, values);
                if (display) {
                  return <DynamicField key={index} field={field} onAddressLookup={onAddressLookup} timeAtAddress={timeAtAddress} handleChange={handleChange} />
                }
              })}

            {activeStep === 'income-savings' && 
              <Announcement variant="success" >
                <h3 className="lbh-heading-h3">Proof of income and savings required</h3>
                <p className="lbh-body-m">Before submitting your application, you will be asked to upload the following:</p>
                <ul className="lbh-list lbh-list--bullet">
                  <li className="lbh-body-m">Bank statements covering the last two months for every account held by each working adult in your household</li>
                  <li className="lbh-body-m">Last two months' payslips for all working adults in your household</li>
                </ul>
              </Announcement>
            }

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
