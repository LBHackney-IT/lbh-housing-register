import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../components/content/headings';
import Announcement from '../../components/announcement';
import Paragraph from '../../components/content/paragraph';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/types/errors';
import { scrollToError } from '../../lib/utils/scroll';
import { confirmVerifyCode, createVerifyCode } from '../../lib/store/auth';
import { loadApplication } from '../../lib/store/application';

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userError, setUserError] = useState<string | null>(null);

  const email = router.query.email as string;
  if (!email) {
    router.push('/apply/sign-in');
  }

  const application = useAppSelector((store) => store.application);
  useEffect(() => {
    if (application.mainApplicant?.person) {
      router.push('/apply/overview');
    } else {
      router.push('/apply/start');
    }
  }, [application]);

  const confirmSignUp = async (values: FormData) => {
    try {
      const code = values.code as string;
      dispatch(confirmVerifyCode({ email, code })).then(() =>
        dispatch(loadApplication())
      );
    } catch (e) {
      console.error(e);
      setUserError(Errors.VERIFY_ERROR);
      scrollToError();
    }
  };

  const resendCode = async () => {
    dispatch(createVerifyCode(email));
  };

  return (
    <Layout pageName="Verify your account">
      <HeadingOne content="Enter your verification code" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Announcement variant="success">
        <Paragraph>
          We have sent an email containing a six digit verification code to:{' '}
          <strong>{email}</strong>.
        </Paragraph>
        <Paragraph>
          Haven't received an email?
          <br />
          <a
            role="button"
            href="#"
            className="lbh-link lbh-link--announcement"
            onClick={() => resendCode()}
          >
            Send a new code
          </a>
        </Paragraph>
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
