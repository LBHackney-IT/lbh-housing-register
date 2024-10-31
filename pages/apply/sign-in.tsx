import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import ErrorSummary from '../../components/errors/error-summary';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { createVerifyCode } from '../../lib/store/auth';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { Errors } from '../../lib/types/errors';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { scrollToError } from '../../lib/utils/scroll';
import Loading from 'components/loading';

const ApplicationSignInPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((store) => store.application.id);
  const router = useRouter();
  const [userError, setUserError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { query } = router;
  const applicationId = query.applicationId as string;

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsSaving(true);
      dispatch(
        createVerifyCode({
          emailAddress: values.emailAddress,
          applicationId: applicationId,
        })
      )
        .unwrap()
        .then(() => {
          setIsSaving(false);
          router.push({
            pathname: '/apply/verify',
            query: { email: values.emailAddress, applicationId: applicationId },
          });
        })
        .catch((err) => {
          setIsSaving(false);
          setUserError(err);
          scrollToError();
        });
    } catch (e) {
      console.error(e);
      setUserError(Errors.SIGNIN_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout
      pageName="Sign in"
      pageLoadsApplication={false}
      dataTestId="test-sign-in-page"
    >
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <HeadingOne content="Your email" />
      <Paragraph>
        We’ll send you a verification code to continue your application
      </Paragraph>
      {isSaving ? (
        <Loading text="Saving..." />
      ) : (
        <Form
          formData={getFormData(FormID.SIGN_IN)}
          buttonText="Continue"
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
};

export default ApplicationSignInPage;
