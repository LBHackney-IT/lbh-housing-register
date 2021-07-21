import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import Button from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { signIn } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { getFormData, SIGN_IN_VERIFY } from '../../lib/utils/form-data';

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((store) => store.cognitoUser?.username);
  if (isLoggedIn) {
    router.push('/apply/overview');
  }

  const dispatch = useAppDispatch();
  const emailAddress = useAppSelector(
    (store) => store.application.mainApplicant?.contactInformation?.emailAddress
  );

  const confirmSignUp = async (values: FormData) => {
    await Auth.confirmSignUp(values.emailAddress, values.code);

    // TODO: turns out we also need to sign in at this point!
    // update so we don't need a password
    dispatch(
      signIn({
        username: values.emailAddress,
        password: 'Testing123!',
      })
    );

    // TODO: update to link to household: HRT-102
    router.push('/apply/overview');
  };

  const resendCode = async (emailAddress: string) => {
    await Auth.resendSignUp(emailAddress);
  };

  return (
    <Layout>
      <HeadingOne content="Enter your verification code" />
      {emailAddress && (
        <>
          <Paragraph>
            We've sent a code to <strong>{emailAddress}</strong> to confirm your
            account. Enter it below.
          </Paragraph>
          <Button onClick={() => resendCode(emailAddress)} secondary>
            Send again
          </Button>
        </>
      )}

      <Form
        initialValues={{ emailAddress }}
        formData={getFormData(SIGN_IN_VERIFY)}
        buttonText="Continue"
        onSubmit={confirmSignUp}
      />
    </Layout>
  );
};

export default ApplicationVerifyPage;
