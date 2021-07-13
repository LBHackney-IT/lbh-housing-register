import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { Applicant } from '../../domain/HousingApi';
import { updateWithFormValues } from '../../lib/store/applicant';
import { useAppDispatch } from '../../lib/store/hooks';
import { ApplicationSteps } from '../../lib/types/application';
import {
    getFormIdsFromApplicationSteps,
    mapApplicantToValues
} from '../../lib/utils/application-forms';
import { getFormData } from '../../lib/utils/form-data';
import { HeadingOne } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';

interface ApplicationFormsProps {
  activeStep?: string;
  baseHref: string;
  onCompletion: () => void;
  onExit?: () => void;
  applicant: Applicant;
  steps: ApplicationSteps[];
}

/**
 * Application form component is made up of multiple forms
 * The idea being that we can offer an overview of the application from this component,
 * as well as a clear journey from the first form to the next, and so on...
 * @param {ApplicationFormsProps} param0 - Property object of the application
 * @returns {JSX.Element}
 */
export default function ApplicationForms({
  activeStep,
  baseHref,
  onCompletion,
  onExit,
  applicant,
  steps,
}: ApplicationFormsProps): JSX.Element | null {
  const router = useRouter();

  const formSteps = getFormIdsFromApplicationSteps(steps);
  const activeStepId =
    formSteps.find((step) => step === activeStep) ?? formSteps[0];
  const formData = getFormData(activeStepId);
  const initialValues: FormikValues = mapApplicantToValues(
    activeStepId,
    applicant
  );

  const dispatch = useAppDispatch();
  const onSave = (values: FormikValues) => {
    dispatch(updateWithFormValues({ activeStepId, values }));
  };

  const onSubmit = () => {
    const index = formSteps.indexOf(activeStepId) + 1;
    if (index === formSteps.length) {
      onCompletion();
    }
    if (formSteps[index]) {
      router.replace(`${baseHref}/${formSteps[index]}`);
    }
  };

  return (
    <>
      {formData.heading && <HeadingOne content={formData.heading} />}
      {formData.copy && (
        <Paragraph>
          <strong>{formData.copy}</strong>
        </Paragraph>
      )}
      <Form
        initialValues={initialValues}
        buttonText="Save and continue"
        formData={formData}
        onExit={onExit}
        onSave={onSave}
        onSubmit={onSubmit}
      />
    </>
  );
}
