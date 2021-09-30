import { Form as FormikForm, Formik, FormikValues } from 'formik';
import { useState } from 'react';
import { FormData, MultiStepForm } from '../../lib/types/form';
import { getDisplayStateOfField } from '../../lib/utils/form';
import { buildValidationSchema } from '../../lib/utils/validation';
import { scrollToTop } from '../../lib/utils/scroll';
import Button from '../button';
import { HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import DynamicField from '../form/dynamic-field';

interface FormProps {
  buttonText?: string;
  formData: MultiStepForm;
  onSave?: (values: FormData) => void;
  onSubmit?: (values: FormData, bag: any) => void;
  initialValues?: FormikValues;
  activeStep?: string;
}

export default function AdminForm({
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
  const calculatedInitialValues = initialValues || {};

  const next = () => {
    scrollToTop();
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = () => {
    scrollToTop();
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: FormData, bag: any) => {
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
        initialValues={calculatedInitialValues}
        onSubmit={handleSubmit}
        validationSchema={buildValidationSchema(step.fields)}
      >
        {({ isSubmitting, values }) => (
          <FormikForm>
            {step.heading && <HeadingTwo content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}

            <table className="govuk-table lbh-table">
              <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
                Medical Outcome
              </caption>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th scope="col" className="govuk-table__header"></th>
                  <th scope="col" className="govuk-table__header"></th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                {step.fields.map((field, index) => {
                  const display: boolean = getDisplayStateOfField(
                    field,
                    values
                  );
                  if (display) {
                    return (
                      <>
                        <tr className="govuk-table__row">
                          <th scope="row" className="govuk-table__header">
                            {field.label}
                          </th>
                          <td className="govuk-table__cell">
                            <DynamicField key={index} field={field} />
                          </td>
                        </tr>
                      </>
                    );
                  }
                })}
              </tbody>
            </table>

            <div className="c-flex lbh-simple-pagination">
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
