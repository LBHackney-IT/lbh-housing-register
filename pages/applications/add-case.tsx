import { useState } from 'react';

import { FormikValues } from 'formik';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import MainApplicantForm from '../../components/admin/MainApplicantForm';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Address as ApiAddress, Application } from '../../domain/HousingApi';
import {
  completeApplication,
  createApplication,
  updateApplication,
} from '../../lib/gateways/internal-api';
import { ApplicationStatus } from '../../lib/types/application-status';
import {
  Address,
  convertAddressToPrimary,
  generateQuestionArray,
} from '../../lib/utils/adminHelpers';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { scrollToError, scrollToTop } from '../../lib/utils/scroll';
import { checkError } from 'lib/utils/errorHelper';

interface PageProps {
  user: HackneyGoogleUser;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const router = useRouter();
  const [addressHistory, setAddressHistory] = useState([] as Address[]);
  const [ethnicity, setEthnicity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | undefined>(undefined);

  const createManualApplication = async (request: Application) => {
    setIsSaving(true);

    try {
      const newApplication = await createApplication(request);
      const completedApplication = await completeApplication(newApplication);
      const setToManualDraft = await updateApplication({
        ...completedApplication,
        status: ApplicationStatus.MANUAL_DRAFT,
      });

      setIsSaving(false);
      router.push(`/applications/view/${setToManualDraft.id}`);
    } catch (err) {
      setIsSaving(false);
      if (checkError(err)) {
        setUserError((err as Error).message);
      } else {
        setUserError('Unable to create application');
      }
      scrollToError();
    }
  };

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
  /*  eslint-disable @typescript-eslint/no-explicit-any */
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
      dataTestId="test-add-case-page"
      isSaving={isSaving}
      userError={userError}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user, true);
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
