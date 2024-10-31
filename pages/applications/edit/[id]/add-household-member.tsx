import React, { useState } from 'react';

import { FormikValues } from 'formik';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import HouseholdMemberForm from '../../../../components/admin/HouseholdMemberForm';
import { HackneyGoogleUser } from '../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../domain/HousingApi';
import { getApplication } from '../../../../lib/gateways/applications-api';
import { updateApplication } from '../../../../lib/gateways/internal-api';
import {
  Address,
  generateQuestionArray,
} from '../../../../lib/utils/adminHelpers';
import { getRedirect, getSession } from '../../../../lib/utils/googleAuth';
import { scrollToError, scrollToTop } from '../../../../lib/utils/scroll';
import Custom404 from '../../../404';
import { checkError } from 'lib/utils/errorHelper';

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddHouseholdMember({
  user,
  data,
}: PageProps): JSX.Element | null {
  const router = useRouter();
  const [addresses, setAddresses] = useState([] as Address[]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userError, setUserError] = useState<string | undefined>(undefined);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addresses);
    const addressToSubmit = addresses.length > 0 ? addresses[0] : {};

    /*  eslint-disable @typescript-eslint/no-explicit-any */
    const householdMemberFormData = {
      person: {
        title: values.personalDetails_title,
        firstName: values.personalDetails_firstName,
        surname: values.personalDetails_surname,
        dateOfBirth: values.personalDetails_dateOfBirth,
        gender: values.personalDetails_gender,
        genderDescription: values.personalDetails_genderDescription,
        nationalInsuranceNumber: values.personalDetails_nationalInsuranceNumber,
        relationshipType: values.personalDetails_relationshipType,
      },
      address: addressToSubmit as any,
      contactInformation: {
        emailAddress: values.personalDetails_emailAddress,
        phoneNumber: values.personalDetails_phoneNumber,
      },
      questions: questionValues,
    };

    if (data.otherMembers) {
      data.otherMembers = [...data.otherMembers, householdMemberFormData];
    }

    const request: Application = {
      id: data.id,
      otherMembers: data.otherMembers,
    };

    setIsSaving(true);

    updateApplication(request)
      .then(() => {
        setIsSaving(false);
        router.push({
          pathname: `/applications/view/${data.id}`,
        });
      })
      .catch((err) => {
        setIsSaving(false);

        if (checkError(err)) {
          setUserError(err.message);
        } else {
          setUserError('Unable to update application');
        }

        scrollToError();
      });
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
    <>
      {data.id ? (
        <HouseholdMemberForm
          isEditing={false}
          user={user}
          onSubmit={onSubmit}
          isSubmitted={isSubmitted}
          addresses={addresses}
          setAddresses={setAddresses}
          handleSaveApplication={handleSaveApplication}
          dataTestId="test-application-add-household-member-page"
          isSaving={isSaving}
          userError={userError}
        />
      ) : (
        <Custom404 />
      )}
    </>
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

  const { id } = context.params as {
    id: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { user, data } };
};
