import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { FormikValues } from 'formik';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import { generateQuestionArray, Address } from '../../lib/utils/adminHelpers';
import { ApplicationStatus } from '../../lib/types/application-status';
import { scrollToTop } from '../../lib/utils/scroll';
import MainApplicantForm from '../../components/admin/MainApplicantForm';

interface PageProps {
  user: HackneyGoogleUser;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const router = useRouter();
  const [addressHistory, setAddressHistory] = useState([] as Address[]);
  const [ethnicity, setEthnicity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(
      values,
      addressHistory,
      ethnicity
    );

    const addressToSubmit = addressHistory.length > 0 ? addressHistory[0] : {};

    const request: Application = {
      status: ApplicationStatus.MANUAL_DRAFT,
      submittedAt: new Date().toISOString(),
      mainApplicant: {
        person: {
          title: values.personalDetails_title,
          firstName: values.personalDetails_firstName,
          surname: values.personalDetails_surname,
          dateOfBirth: values.personalDetails_dateOfBirth,
          gender: values.personalDetails_gender,
          genderDescription: '',
          nationalInsuranceNumber:
            values.personalDetails_nationalInsuranceNumber,
        },
        address: addressToSubmit as any,
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
      otherMembers: [],
      assignedTo: user.email,
    };

    createApplication(request).then(() => {
      router.push({
        pathname: '/applications/view-register',
        query: { status: ApplicationStatus.MANUAL_DRAFT },
      });
    });
  };

  const handleSaveApplication = (isValid: any, touched: any) => {
    const isTouched = Object.keys(touched).length !== 0;
    if (!isValid || !isTouched) {
      scrollToTop();
    }

    setIsSubmitted(true);
  };

  return (
    <MainApplicantForm
      isEditing={false}
      user={user}
      onSubmit={onSubmit}
      isSubmitted={isSubmitted}
      addressHistory={addressHistory}
      setAddressHistory={setAddressHistory}
      handleSaveApplication={handleSaveApplication}
      ethnicity={ethnicity}
      setEthnicity={setEthnicity}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  return { props: { user } };
};
