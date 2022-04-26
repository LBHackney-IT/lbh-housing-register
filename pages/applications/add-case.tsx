import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { FormikValues } from 'formik';
import { Application, Address as ApiAddress } from '../../domain/HousingApi';
import {
  generateQuestionArray,
  Address,
  convertAddressToPrimary,
} from '../../lib/utils/adminHelpers';

import {
  createApplication,
  completeApplication,
  updateApplication,
} from '../../lib/gateways/internal-api';
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

    const firstAddressHistoryItem =
      addressHistory.length > 0 ? addressHistory[0] : ({} as Address);
    const primaryAddress = convertAddressToPrimary(firstAddressHistoryItem);

    const request: Application = {
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
        address: primaryAddress as ApiAddress,
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
      otherMembers: [],
      assignedTo: user.email,
    };

    createManualApplication(request);
  };

  const createManualApplication = async (request: Application) => {
    const newApplication = await createApplication(request);
    const completedApplication = await completeApplication(newApplication);
    const setToManualDraft = await updateApplication({
      ...completedApplication,
      status: ApplicationStatus.MANUAL_DRAFT,
    });

    router.push(`/applications/view/${setToManualDraft.id}`);
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
