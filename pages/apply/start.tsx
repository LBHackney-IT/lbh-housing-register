import Auth from '@aws-amplify/auth';
import { useState } from 'react';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { createApplication } from '../../lib/store/application';
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from '../../lib/store/hooks';
import { updateBeforeFirstSave } from '../../lib/store/mainApplicant';
import { FormID, getFormData } from '../../lib/utils/form-data';
import processPhonenumber from '../../lib/utils/processPhonenumber';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/utils/errors';
import { scrollToError } from '../../lib/utils/scroll';

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((store) => store.cognitoUser?.username);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const [userError, setUserError] = useState<string | null>(null);

  if (isLoggedIn) {
    router.push('/apply/overview');
  }

  const signUp = async (values: FormikValues) => {
    const phone = values.phoneNumber && processPhonenumber(values.phoneNumber);

    try {
      await Auth.signUp({
        username: values.emailAddress,
        // See https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
        // on how to generate a random password securely.
        password: values.password,
        attributes: {
          given_name: values.firstName,
          family_name: values.surname,
          phone_number: phone, // E.164 number convention
        },
      });

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
            emailAddress: values.emailAddress,
            phoneNumber: phone,
          },
        })
      );

      dispatch(createApplication(store.getState().application));

      router.push('/apply/verify');
    } catch (error) {
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout pageName="Start your application">
      <HeadingOne content="Start your application" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Form
        formData={getFormData(FormID.SIGN_UP_DETAILS)}
        buttonText="Save and continue"
        onSubmit={signUp}
      />
    </Layout>
  );
};

export default ApplicationStartPage;
