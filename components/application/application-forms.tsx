import { FormikValues } from 'formik';
import { batch } from 'react-redux';
import { Applicant } from '../../domain/HousingApi';
import {
  applicantHasId,
  getQuestionsForFormAsValues,
  markSectionAsComplete,
  updateWithFormValues,
} from '../../lib/store/applicant';
import { useAppDispatch } from '../../lib/store/hooks';
import { ApplicationSectionGroup } from '../../lib/types/application';
import { getFormIdsFromApplicationSections } from '../../lib/utils/application-forms';
import { getFormData } from '../../lib/utils/form-data';
import { HeadingOne } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';

interface ApplicationFormsProps {
  activeStep?: string;
  onSubmit?: () => void;
  applicant: Applicant;
  sectionGroups: ApplicationSectionGroup[];
}

/**
 * Application form component is made up of multiple forms
 * The idea being that we can offer an overview of the application from this component,
 * as well as a clear journey from the first form to the next, and so on...
 * @param {ApplicationFormsProps} param0 - Property object of the application
 * @returns {JSX.Element}
 * @deprecated don't use this. See personal-details.tsx for a better pattern.
 */
export default function ApplicationForms({
  activeStep,
  onSubmit,
  applicant,
  sectionGroups,
}: ApplicationFormsProps): JSX.Element | null {
  const formSteps = getFormIdsFromApplicationSections(sectionGroups);
  const activeStepId =
    formSteps.find((step) => step === activeStep) ?? formSteps[0];
  const formData = getFormData(activeStepId);
  const initialValues: FormikValues = getQuestionsForFormAsValues(
    activeStepId,
    applicant
  );

  const dispatch = useAppDispatch();
  const onSave = (values: FormikValues) => {
    // TODO store eligibility answer.
    if (applicantHasId(applicant)) {
      batch(() => {
        dispatch(
          updateWithFormValues({
            formID: activeStepId,
            personID: applicant.person.id,
            values,
          })
        );
        dispatch(
          markSectionAsComplete({
            formID: activeStepId,
            personID: applicant.person.id,
          })
        );
      });
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
        onSave={onSave}
        onSubmit={onSubmit}
      />
    </>
  );
}
