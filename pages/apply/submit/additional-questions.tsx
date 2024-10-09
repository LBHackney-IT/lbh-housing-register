import { FormikValues } from 'formik';
import { HeadingOne, HeadingFour } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import {
  getQuestionsForFormAsValues,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import withApplication from '../../../lib/hoc/withApplication';
import { Applicant } from '../../../domain/HousingApi';
import { useState } from 'react';
import { scrollToError } from '../../../lib/utils/scroll';
import useApiCallStatus from 'lib/hooks/useApiCallStatus';
import {
  selectSaveApplicationStatus,
  ApiCallStatusCode,
} from 'lib/store/apiCallsStatus';
import { Errors } from 'lib/types/errors';
import Loading from 'components/loading';
import ErrorSummary from 'components/errors/error-summary';

const AdditonalQuestions = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const applicant = useAppSelector(
    (store) => store.application.mainApplicant
  ) as Applicant;
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);

  const returnHref = '/apply/submit/ethnicity-questions';
  useApiCallStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSaved,
    setUserError,
    pathToPush: returnHref,
    scrollToError,
  });

  if (!applicant) {
    return <Custom404 />;
  }

  const initialValues = {
    ...getQuestionsForFormAsValues(FormID.ADDITIONAL_QUESTIONS, applicant),
  };

  const onSubmit = (values: FormikValues) => {
    try {
      dispatch(
        updateWithFormValues({
          formID: FormID.ADDITIONAL_QUESTIONS,
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
      dataTestId="test-additional-questions-page"
    >
      <HeadingOne content="Before you submit" />
      {userError && (
        <ErrorSummary dataTestId="test-additional-questions-error-summary">
          {userError}
        </ErrorSummary>
      )}
      <HeadingFour content="Do any of the following apply to your household?" />
      <p className="lbh-body lbh-body--grey">Select all options that apply.</p>
      {saveApplicationStatus?.callStatus === ApiCallStatusCode.PENDING ? (
        <Loading text="Saving..." />
      ) : (
        <Form
          initialValues={initialValues}
          buttonText="Save and continue"
          formData={getFormData(FormID.ADDITIONAL_QUESTIONS)}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
};

export default withApplication(AdditonalQuestions);
