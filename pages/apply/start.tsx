import { useState } from 'react';

import { FormikValues } from 'formik';
import { useRouter } from 'next/router';

import { HeadingOne } from '../../components/content/headings';
import ErrorSummary from '../../components/errors/error-summary';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch } from '../../lib/store/hooks';
import { updateBeforeFirstSave } from '../../lib/store/mainApplicant';
import { Errors } from '../../lib/types/errors';
import { FormID, getFormData } from '../../lib/utils/form-data';
import processPhonenumber from '../../lib/utils/processPhonenumber';
import { scrollToError } from '../../lib/utils/scroll';

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userError, setUserError] = useState<string | null>(null);

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

      router.push('/apply/agree-terms');
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
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Form
        formData={getFormData(FormID.SIGN_UP_DETAILS)}
        buttonText="Continue"
        onSubmit={signUp}
      />
    </Layout>
  );
};

export default ApplicationStartPage;
