import { useCallback, useState, type ReactNode } from 'react';

import { FormikValues } from 'formik';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MainApplicantForm from '../../components/admin/MainApplicantForm';
import { StaffUser } from '../../domain/StaffUser';
import { authorizeStaffPage } from '../../lib/auth/page';
import { Address as ApiAddress, Application } from '../../domain/HousingApi';
import {
  completeApplication,
  CreateApplicationError,
  createApplication,
  updateApplication,
} from '../../lib/gateways/internal-api';
import { ApplicationStatus } from '../../lib/types/application-status';
import {
  Address,
  convertAddressToPrimary,
  generateQuestionArray,
} from '../../lib/utils/adminHelpers';
import { scrollToTop } from '../../lib/utils/scroll';
import { isAssignableToError } from 'lib/utils/errorHelper';

interface PageProps {
  user: StaffUser;
}

const EMAIL_FIELD_NAME = 'personalDetails_emailAddress';
const DUPLICATE_EMAIL_FIELD_ERROR =
  'An application already exists for this email address. Enter a different email address, or leave it blank.';

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const router = useRouter();
  const [addressHistory, setAddressHistory] = useState([] as Address[]);
  const [ethnicity, setEthnicity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userError, setUserError] = useState<ReactNode>(null);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const clearSubmitErrors = useCallback(() => {
    setUserError(null);
    setEmailError(undefined);
  }, []);

  const createManualApplication = async (request: Application) => {
    setIsSaving(true);
    clearSubmitErrors();

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
      // Handle 409 error responses which may have multiple historic applications with the same email address.
      if (
        err instanceof CreateApplicationError &&
        err.status === 409 &&
        err.applicationIds.length > 0
      ) {
        setEmailError(DUPLICATE_EMAIL_FIELD_ERROR);
        setUserError(
          <>
            {err.message}{' '}
            <a href={`#${EMAIL_FIELD_NAME}`}>Change the email address</a> or
            leave it blank to create an application without one.{' '}
            {err.applicationIds.map((id, index) => (
              <span key={id}>
                {index > 0 ? ', ' : ''}
                <Link
                  href={`/applications/view/${id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {err.applicationIds.length === 1
                    ? 'View existing case'
                    : `View case ${index + 1}`}
                </Link>
              </span>
            ))}
            {' (opens in a new tab).'}
          </>,
        );
      } else if (isAssignableToError(err)) {
        setUserError((err as Error).message);
      } else {
        setUserError('Unable to create application');
      }
      scrollToTop();
    }
  };

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(
      values,
      addressHistory,
      ethnicity,
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
          emailAddress: values[EMAIL_FIELD_NAME],
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
      otherMembers: [],
      assignedTo: user.email,
    };

    return createManualApplication(request);
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
      fieldErrors={{ [EMAIL_FIELD_NAME]: emailError }}
      onClearSubmitErrors={clearSubmitErrors}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authorization = await authorizeStaffPage(context, { write: true });
  if ('redirect' in authorization) return authorization;
  const { user } = authorization;

  return { props: { user } };
};
