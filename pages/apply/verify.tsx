import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import { ApplicationStatus } from '../../lib/types/application-status';

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userError, setUserError] = useState<string | null>(null);

  const application = useAppSelector((store) => store.application);
  // console.log(application);

  const emailAddress = useAppSelector(
    (store) =>
      store.application.mainApplicant?.contactInformation?.emailAddress ?? ''
  );
  // if (emailAddress === '') {
  //   router.push('/apply/start');
  // }

  const confirmSignUp = async (values: FormData) => {
    try {
      // retrieve
      const code = values.code as string;
      dispatch(confirmVerifyCode({ email, code }));

      // router.push('/apply/agree-terms');
      router.push('/apply/start');

      // if (status === ApplicationStatus.INCOMPLETE) {
      //   router.push('/apply/start');
      // } else {
      //   router.push('apply/overview');
      // }
    } catch (e) {
      setUserError(Errors.VERIFY_ERROR);
      scrollToError();
    }
  };

  const resendCode = async () => {
    dispatch(createVerifyCode(application));
  };

  return (
    <Layout pageName="Verify your account">
      <HeadingOne content="Enter your verification code" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Announcement variant="success">
        <Paragraph>
          We have sent an email containing a six digit verification code to:{' '}
          <strong>{emailAddress}</strong>.
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
