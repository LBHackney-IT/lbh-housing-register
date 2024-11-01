import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Announcement from '../../components/announcement';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import ErrorSummary from '../../components/errors/error-summary';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { loadApplication } from '../../lib/store/application';
import { confirmVerifyCode, createVerifyCode } from '../../lib/store/auth';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { Errors } from '../../lib/types/errors';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { scrollToError } from '../../lib/utils/scroll';
import Loading from 'components/loading';

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userError, setUserError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  const email = router.query.email as string;

  const application = useAppSelector((store) => store.application);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (application.mainApplicant?.person) {
      router.push('/apply/overview');
      return;
    }

    if (application.id) {
      router.push('/apply/start');
      return;
    }

    if (!email) {
      router.push('/apply/sign-in');
    }
  }, [application, router]);

  const confirmSignUp = async (values: FormData) => {
    try {
      const code = values.code as string;
      setIsSaving(true);
      dispatch(confirmVerifyCode({ email, code }))
        .unwrap()
        .then(() => {
          setIsSaving(false);
          dispatch(loadApplication())
            .unwrap()
            .catch((err) => {
              setUserError(err);
              scrollToError();
            });
        })
        .catch((err) => {
          setIsSaving(false);
          setUserError(err);
          scrollToError();
        });
    } catch (e) {
      setUserError(Errors.VERIFY_ERROR);
      scrollToError();
    }
  };

  const resendCode = async () => {
    dispatch(createVerifyCode({ emailAddress: email }));
    setCodeSent(true);
  };

  return (
    <Layout
      pageName="Verify your account"
      pageLoadsApplication={false}
      dataTestId="test-verify-code-page"
    >
      <HeadingOne content="Enter your verification code" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}

      {isSaving ? (
        <Loading text="Saving..." />
      ) : (
        <>
          <Announcement variant="success">
            <Paragraph>
              We have sent an email containing a six digit verification code to{' '}
              <strong>{email}</strong>
            </Paragraph>
            <Paragraph>
              {codeSent ? (
                <>
                  New code sent to <strong>{email}</strong>
                </>
              ) : (
                <>
                  Haven't received an email?
                  <br />
                  <a>
                    <button
                      type="button"
                      className="lbh-link lbh-link--announcement"
                      onClick={resendCode}
                    >
                      Send a new code
                    </button>
                  </a>
                </>
              )}
            </Paragraph>
          </Announcement>
          <Form
            formData={getFormData(FormID.SIGN_IN_VERIFY)}
            buttonText="Continue"
            onSubmit={confirmSignUp}
          />
        </>
      )}
    </Layout>
  );
};

export default ApplicationVerifyPage;
