import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { signIn } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { FormData } from '../../lib/types/form';
import { getFormData, SIGN_IN } from '../../lib/utils/form-data';

const ApplicationSignInPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.cognitoUser?.username);
  const router = useRouter();

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
        username: values.email,
        password: values.password,
      })
    );
  };

  return (
    <Layout>
      <HeadingOne content="Sign in to your application" />
      {/* TODO not everything should use Formik. */}
      <Form
        formData={getFormData(SIGN_IN)}
        buttonText="Continue"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default ApplicationSignInPage;
