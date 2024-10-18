import { FormikValues, getIn } from 'formik';
import { useState } from 'react';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { updateWithFormValues } from '../../../lib/store/applicant';
import withApplication from '../../../lib/hoc/withApplication';
import { Applicant } from '../../../domain/HousingApi';
import Loading from 'components/loading';
import { scrollToError } from '../../../lib/utils/scroll';
import { selectSaveApplicationStatus } from 'lib/store/apiCallsStatus';
import useApiCallStatus from 'lib/hooks/useApiCallStatus';
import ErrorSummary from 'components/errors/error-summary';
import { Errors } from 'lib/types/errors';

const EthnicityQuestions = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const applicant = useAppSelector(
    (store) => store.application.mainApplicant
  ) as Applicant;

  const [formId, setFormId] = useState('ethnicity-questions');
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [activeStepID, setActiveStepId] = useState(() => {
    switch (formId) {
      case 'ethnicity-extended-category-asian-asian-british':
        return FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH;

      case 'ethnicity-extended-category-black-black-british':
        return FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH;

      case 'ethnicity-extended-category-mixed-multiple-background':
        return FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND;

      case 'ethnicity-extended-category-white':
        return FormID.ETHNICITY_CATEGORY_WHITE;

      case 'ethnicity-extended-category-other-ethnic-group':
        return FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP;

      default:
        return FormID.ETHNICITY_QUESTIONS;
    }
  });
  const formData = getFormData(activeStepID);

  const { delayedPendingStatus } = useApiCallStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSaved,
    setUserError,
    pathToPush: '/apply/submit/declaration',
    scrollToError,
  });

  if (!applicant) {
    return <Custom404 />;
  }

  const nextStep = (values: FormikValues) => {
    const { nextFormId } = formData.conditionals?.find(
      (element) => getIn(values, element.fieldId) === element.value
    ) ?? { nextFormId: 'exit' };

    if (nextFormId === 'exit') {
      try {
        dispatch(
          updateWithFormValues({
            formID: activeStepID,
            personID: applicant.person!.id!,
            values,
            markAsComplete: true,
          })
        );
        setHasSaved(true);
      } catch (error) {
        console.error('Error saving agreement:', error);
        setUserError(Errors.GENERIC_ERROR);
        scrollToError();
      }
      return;
    }

    setFormId(nextFormId);
    setActiveStepId(nextFormId);
  };

  const onSave = (values: FormikValues) => {
    try {
      dispatch(
        updateWithFormValues({
          formID: activeStepID,
          personID: applicant.person!.id!,
          values,
          markAsComplete: true,
        })
      );
      setHasSaved(true);
    } catch (error) {
      console.error('Error saving agreement:', error);
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout
      pageName="Before you submit"
      dataTestId="test-ethnicity-questions-page"
    >
      <HeadingOne content="Before you submit" />
      {userError && (
        <ErrorSummary dataTestId="test-ethnicity-questions-error-summary">
          {userError}
        </ErrorSummary>
      )}
      {delayedPendingStatus ? (
        <Loading text="Saving..." />
      ) : (
        <Form
          key={activeStepID}
          buttonText="Save and continue"
          formData={formData}
          onSave={onSave}
          onSubmit={nextStep}
        />
      )}
    </Layout>
  );
};

export default withApplication(EthnicityQuestions);
