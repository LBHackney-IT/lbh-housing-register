import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { FormikValues } from 'formik';
import { getRedirect, getSession } from '../../../../lib/utils/googleAuth';
import { HackneyGoogleUser } from '../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../domain/HousingApi';
import { getApplication } from '../../../../lib/gateways/applications-api';
import { updateApplication } from '../../../../lib/gateways/internal-api';
import {
  generateQuestionArray,
  Address,
} from '../../../../lib/utils/adminHelpers';

import { scrollToTop } from '../../../../lib/utils/scroll';
import Custom404 from '../../../404';
import HouseholdMemberForm from '../../../../components/admin/HouseholdMemberForm';
interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddHouseholdMember({
  user,
  data,
}: PageProps): JSX.Element | null {
  if (!data.id) return <Custom404 />;
  const router = useRouter();

  const [addresses, setAddresses] = useState([] as Address[]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addresses);

    const householdMemberFormData = {
      person: {
        title: values.personalDetails_title,
        firstName: values.personalDetails_firstName,
        surname: values.personalDetails_surname,
        dateOfBirth: values.personalDetails_dateOfBirth,
        gender: values.personalDetails_gender,
        genderDescription: '',
        nationalInsuranceNumber: values.personalDetails_nationalInsuranceNumber,
      },
      address: addresses[0].address || null,
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

    updateApplication(request);
    setTimeout(
      () =>
        router.push({
          pathname: `/applications/view/${data.id}`,
        }),
      500
    );
  };

  const handleSaveApplication = () => {
    setIsSubmitted(true);
    scrollToTop();
  };

  return (
    <HouseholdMemberForm
      isEditing={false}
      user={user}
      onSubmit={onSubmit}
      isSubmitted={isSubmitted}
      addresses={addresses}
      setAddresses={setAddresses}
      handleSaveApplication={handleSaveApplication}
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
