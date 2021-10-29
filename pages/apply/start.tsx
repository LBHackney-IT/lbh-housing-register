import { useState } from 'react';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { createApplication } from '../../lib/store/application';
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from '../../lib/store/hooks';
import { updateBeforeFirstSave } from '../../lib/store/mainApplicant';
import { FormID, getFormData } from '../../lib/utils/form-data';
import processPhonenumber from '../../lib/utils/processPhonenumber';
import ErrorSummary from '../../components/errors/error-summary';
import { Errors } from '../../lib/types/errors';
import { scrollToError } from '../../lib/utils/scroll';
import { createVerifyCode } from '../../lib/store/auth';

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const [userError, setUserError] = useState<string | null>(null);

  const signUp = async (values: FormikValues) => {
    const phone = values.phoneNumber && processPhonenumber(values.phoneNumber);

    try {
      dispatch(
        updateBeforeFirstSave({
          person: {
            title: values.title,
            firstName: values.firstName,
            surname: values.surname,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,
            genderDescription: values.genderDescription,
            nationalInsuranceNumber: values.nationalInsuranceNumber,
          },
          contactInformation: {
            emailAddress: values.emailAddress : state,
            phoneNumber: phone,
          },
        })
      );     

      dispatch(updateApplication(store.getState().application)).then(
        // (action: any) => {
        //   dispatch(createVerifyCode(action.payload));
        // }
      );

      router.push('/apply/agree-terms');
      // router.push('/apply/overview');
    } catch (error) {
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout pageName="Start your application">
      <HeadingOne content="Start your application" />
      {userError && <ErrorSummary>{userError}</ErrorSummary>}
      <Form
        formData={getFormData(FormID.SIGN_UP_DETAILS)}
        buttonText="Continue"
        onSubmit={signUp}
      />
    </Layout>
  );
};

export default ApplicationStartPage;
