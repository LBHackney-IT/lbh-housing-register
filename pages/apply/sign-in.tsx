import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/types/errors';
import { scrollToError } from '../../lib/utils/scroll';
import Paragraph from '../../components/content/paragraph';
import { createVerifyCode } from '../../lib/store/auth';

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
    try {
      dispatch(createVerifyCode(values.emailAddress));

      router.push({
        pathname: '/apply/verify',
        query: { email: values.emailAddress },
      });
    } catch (e) {
      console.error(e);
      setUserError(Errors.SIGNIN_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout pageName="Sign in" pageLoadsApplication={false}>
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <HeadingOne content="Your email" />
      <Paragraph>
        We’ll send you a verification code to continue your application
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
