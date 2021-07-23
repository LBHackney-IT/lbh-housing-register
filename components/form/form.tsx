import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { useMemo, useState } from 'react';
import Announcement from '../../components/announcement';
import { FormData, MultiStepForm } from '../../lib/types/form';
import { getDisplayStateOfField } from '../../lib/utils/form';
import { buildValidationSchema } from '../../lib/utils/validation';
import Button from '../button';
import { HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import DynamicField from './dynamic-field';
interface FormProps {
  buttonText?: string;
  formData: MultiStepForm;
  onSave?: (values: FormData) => void;
  onSubmit?: (values: FormData, bag: any) => void;
  initialValues?: FormikValues;
  activeStep?: string;
}

export default function Form({
  buttonText,
  formData,
  onSave,
  onSubmit,
  initialValues,
  activeStep,
}: FormProps): JSX.Element {
  const [stepNumber, setStepNumber] = useState(0);

  const step = formData.steps[stepNumber];
  const totalSteps = formData.steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const schema = buildValidationSchema(step.fields);

  const calculatedInitialValues = useMemo(
    () => initialValues || schema.getDefault(),
    [initialValues, schema]
  );

  const next = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = () => {
    // TODO: Scroll to top + set focus to first field
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: FormData, bag: any) => {
    // TODO Do we really need two handlers for onSave and onSubmit?
    if (onSave) {
      onSave(values);
    }

    if (isLastStep && onSubmit) {
      onSubmit(values, bag);
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
                    handleChange={handleChange} // todo what's this for?
                  />
                );
              }
            })}
            {activeStep === 'income-savings' && (
              <Announcement variant="success">
                <h3 className="lbh-heading-h3">
                  Proof of income and savings required
                </h3>
                <p className="lbh-body-m">
                  Before submitting your application, you will be asked to
                  upload the following:
                </p>
                <ul className="lbh-list lbh-list--bullet">
                  <li className="lbh-body-m">
                    Bank statements covering the last two months for every
                    account held by each working adult in your household
                  </li>
                  <li className="lbh-body-m">
                    Last two months' payslips for all working adults in your
                    household
                  </li>
                </ul>
              </Announcement>
            )}
            {values['medical-needs'] === 'yes' &&
              activeStep === 'medical-needs' && (
                <Announcement variant="success">
                  <h3 className="lbh-heading-h3">
                    You will need to complete a separate medical form
                  </h3>
                  <p className="lbh-body-m">
                    After you have submitted this application, you will be asked
                    to provide detailed information about your medical needs in
                    a separate form.
                  </p>
                </Announcement>
              )}
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
                <Button disabled={isSubmitting} type="submit">
                  {buttonText ? buttonText : 'Save'}
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
}
