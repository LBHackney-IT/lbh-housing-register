import { Auth } from 'aws-amplify';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { updateApplicant } from '../../lib/store/applicant';
import { createApplication } from '../../lib/store/application';
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from '../../lib/store/hooks';
import { FormID, getFormData } from '../../lib/utils/form-data';

export function processPhonenumber(input: string): string {
  const chars = input.match(/[\+0-9]/g);

  if (!chars) {
    return '';
  }
  if (chars[0] === '0') {
    return ['+44', ...chars.slice(1)].join('');
  }
  if (chars[0] !== '+') {
    return ['+44', ...chars].join('');
  }
  return chars.join('');
}

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((store) => store.cognitoUser?.username);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  if (isLoggedIn) {
    router.push('/apply/overview');
  }

  const signUp = async (values: FormikValues) => {
    const phone = values.phoneNumber && processPhonenumber(values.phoneNumber);

    await Auth.signUp({
      username: values.emailAddress,
      // See https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
      // on how to generate a random password securely.
      password: values.password,
      attributes: {
        given_name: values.firstName,
        family_name: values.surname,
        phone_number: phone, // E.164 number convention
      },
    });

    dispatch(
      updateApplicant({
        person: {
          firstName: values.firstName,
          surname: values.surname,
        },
        contactInformation: {
          emailAddress: values.emailAddress,
          phoneNumber: phone,
        },
      })
    );

    dispatch(createApplication(store.getState().application));

    router.push('/apply/verify');
  };

  return (
    <Layout>
      <HeadingOne content="Start your application" />
      <Form
        formData={getFormData(FormID.SIGN_UP_DETAILS)}
        buttonText="Save and continue"
        onSubmit={signUp}
      />
    </Layout>
  );
};

export default ApplicationStartPage;
