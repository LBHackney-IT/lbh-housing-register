import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import { Application } from '../../../../../domain/HousingApi';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../../lib/utils/googleAuth';
import { updateApplication } from '../../../../../lib/gateways/internal-api';
import Custom404 from '../../../../404';
import { HackneyGoogleUser } from '../../../../../domain/HackneyGoogleUser';
import {
  Address,
  generateQuestionArray,
} from '../../../../../lib/utils/adminHelpers';
import { scrollToTop } from '../../../../../lib/utils/scroll';
import MainApplicantForm from '../../../../../components/admin/MainApplicantForm';
interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
  person: string;
  evidenceLink: string;
}

export default function EditApplicant({
  user,
  data,
  person,
  evidenceLink,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;
  const router = useRouter();

  const savedAddresses =
    data.mainApplicant?.questions?.filter(
      (question) => question.id === 'address-history/addressHistory'
    )[0]?.answer || '';

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addressHistory, setAddressHistory] = useState(
    JSON.parse(savedAddresses) as Address[]
  );

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addressHistory);
    const addressToSubmit = addressHistory.length > 0 ? addressHistory[0] : {};

    const request: Application = {
      id: data.id,
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
    };

    updateApplication(request).then(() => {
      router.push({
        pathname: `/applications/view/${data.id}`,
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
      isEditing={true}
      user={user}
      onSubmit={onSubmit}
      isSubmitted={isSubmitted}
      addressHistory={addressHistory}
      setAddressHistory={setAddressHistory}
      handleSaveApplication={handleSaveApplication}
      data={data}
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

  const { id, person } = context.params as {
    id: string;
    person: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  const evidenceLink = process.env.NEXT_PUBLIC_EVIDENCE_STORE || null;
  return { props: { user, data, person, evidenceLink } };
};
