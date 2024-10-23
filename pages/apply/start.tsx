import { useState } from 'react';

import { FormikValues } from 'formik';

import { HeadingOne } from '../../components/content/headings';
import ErrorSummary from '../../components/errors/error-summary';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { updateBeforeFirstSave } from '../../lib/store/mainApplicant';
import { Errors } from '../../lib/types/errors';
import { FormID, getFormData } from '../../lib/utils/form-data';
import processPhonenumber from '../../lib/utils/processPhonenumber';
import { scrollToError } from '../../lib/utils/scroll';
import { selectSaveApplicationStatus } from 'lib/store/apiCallsStatus';
import Loading from 'components/loading';
import useApiCallSelectorStatus from 'lib/hooks/useApiCallStatus';

const ApplicationStartPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);

  const [hasSignedUp, setHasSignedUp] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  const { pendingStatus } = useApiCallSelectorStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSignedUp,
    setUserError,
    scrollToError,
    pathToPush: '/apply/agree-terms',
  });

  const signUp = async (values: FormikValues) => {
    const phone = values.phoneNumber && processPhonenumber(values.phoneNumber);

    try {
      dispatch(
        updateBeforeFirstSave({
          person: {
            title: values.title,
            firstName: values.firstName,
            surname: values.surname,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,
            genderDescription: values.genderDescription,
            nationalInsuranceNumber: values.nationalInsuranceNumber,
          },
          contactInformation: {
            phoneNumber: phone,
          },
        })
      );
      setHasSignedUp(true);
    } catch (error) {
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout
      pageName="Start your application"
      dataTestId="test-start-application-page"
    >
      <HeadingOne content="Start your application" />
      {userError && (
        <ErrorSummary dataTestId="test-start-page-error-summary">
          {userError}
        </ErrorSummary>
      )}
      {pendingStatus ? (
        <Loading text="Saving..." />
      ) : (
        <Form
          formData={getFormData(FormID.SIGN_UP_DETAILS)}
          buttonText="Continue"
          onSubmit={signUp}
        />
      )}
    </Layout>
  );
};

export default ApplicationStartPage;
