import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { signIn } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/utils/errors';
import { scrollToError } from '../../lib/utils/scroll';

const ApplicationSignInPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.cognitoUser?.username);
  const router = useRouter();

  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  const onSubmit = async (values: FormData) => {
    // TODO Handle sign in failed. The dispatch returns a promise that has an erorr key although there's
    // a typing problem with it and I wouldn't know how to pass it back to the Formik validation layer.
    dispatch(
      signIn({
        username: values.emailAddress,
        password: values.password,
      })
    ).then((result: any) => {
      if (result.error) {
        setUserError(Errors.GENERIC_ERROR);
        scrollToError();
      }
      return result;
    });
  };

  return (
    <Layout pageName="Sign in">
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <HeadingOne content="Sign in to your application" />
      {/* TODO not everything should use Formik. */}
      <Form
        formData={getFormData(FormID.SIGN_IN)}
        buttonText="Continue"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default ApplicationSignInPage;
