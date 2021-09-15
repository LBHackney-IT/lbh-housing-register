import Auth from '@aws-amplify/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Announcement from '../../components/announcement';
import Paragraph from '../../components/content/paragraph';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { signIn } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/utils/errors';
import { scrollToError } from '../../lib/utils/scroll';

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userError, setUserError] = useState<string | null>(null);

  const emailAddress = useAppSelector(
    (store) =>
      store.application.mainApplicant?.contactInformation?.emailAddress ?? ''
  );
  if (emailAddress === '') {
    router.push('/apply/start');
  }

  const confirmSignUp = async (values: FormData) => {
    try {
      await Auth.confirmSignUp(emailAddress, values.code);

      // TODO: turns out we also need to sign in at this point!
      // update so we don't need a password
      dispatch(
        signIn({
          username: emailAddress,
          password: 'Testing123!',
        })
      );

      router.push('/apply/agree-terms');
    } catch (e) {
      setUserError(Errors.VERIFY_ERROR);
      scrollToError();
    }
  };

  const resendCode = async (emailAddress: string) => {
    await Auth.resendSignUp(emailAddress);
  };

  return (
    <Layout pageName="Verify your account">
      <HeadingOne content="Enter your verification code" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Announcement variant="success">
        <Paragraph>
          We've sent an email containing a six-digit verification code to{' '}
          <strong>{emailAddress}</strong>.
        </Paragraph>
        <Paragraph>Haven't received an email?</Paragraph>
        <Button onClick={() => resendCode(emailAddress)} secondary>
          Send again
        </Button>
      </Announcement>

      <Form
        formData={getFormData(FormID.SIGN_IN_VERIFY)}
        buttonText="Continue"
        onSubmit={confirmSignUp}
      />
    </Layout>
  );
};

export default ApplicationVerifyPage;
