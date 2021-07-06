import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/resident-layout';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import Form from '../../components/form/form';
import { FormData } from '../../lib/types/form';
import { getFormData, SIGN_IN } from '../../lib/utils/form-data';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { loadUser } from '../../lib/store/cognitoUser';
import { useEffect } from 'react';

const ApplicationSignInPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.cognitoUser?.username);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  const signIn = async (values: FormData) => {
    // TODO convert to Thunk.
    await Auth.signIn(values.email, values.password);
    dispatch(loadUser());
  };

  return (
    <Layout>
      <HeadingOne content="Sign in to your application" />
      {/* TODO not everything should use Formik. */}
      <Form
        formData={getFormData(SIGN_IN)}
        buttonText="Continue"
        onSubmit={signIn}
      />
    </Layout>
  );
};

export default ApplicationSignInPage;
