import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import ErrorSummary from '../../components/errors/error-summary';
import Paragraph from '../../components/content/paragraph';
import { createVerifyCode } from '../../lib/gateways/applications-api';

const ApplicationSignInPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((store) => store.application.id);
  const router = useRouter();

  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  const onSubmit = async (values: FormData) => {
    // TODO create a verify code based on email provided and send to verify page
    // dispatch(createVerifyCode(values.emailAddress));
    router.push('/apply/verify');
  };

  return (
    <Layout pageName="Sign in">
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <HeadingOne content="Start now" />
      {/* TODO not everything should use Formik. */}
      <Paragraph>
        We’ll email you a verification code to continue your application
      </Paragraph>
      <Form
        formData={getFormData(FormID.SIGN_IN)}
        buttonText="Continue"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default ApplicationSignInPage;
