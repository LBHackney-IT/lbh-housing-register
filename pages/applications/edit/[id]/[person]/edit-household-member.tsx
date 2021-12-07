import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { Application } from '../../../../../domain/HousingApi';
import { UserContext } from '../../../../../lib/contexts/user-context';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../../lib/utils/googleAuth';
import { updateApplication } from '../../../../../lib/gateways/internal-api';
import Custom404 from '../../../../404';
import { HackneyGoogleUser } from '../../../../../domain/HackneyGoogleUser';
import {
  getSectionData,
  Address,
  addCaseSchema,
  generateQuestionArray,
  generateEditInitialValues,
} from '../../../../../lib/utils/adminHelpers';
import { scrollToTop } from '../../../../../lib/utils/scroll';
import { FormID } from '../../../../../lib/utils/form-data';
import { HeadingOne } from '../../../../../components/content/headings';
import Layout from '../../../../../components/layout/staff-layout';
import ErrorSummary from '../../../../../components/errors/error-summary';
import AddCaseSection from '../../../../../components/admin/AddCaseSection';
import AddCaseAddress from '../../../../../components/admin/AddCaseAddress';
import Button from '../../../../../components/button';
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
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;
  const router = useRouter();

  const isMainApplicant = data.mainApplicant?.person?.id === person;
  const personData = data.otherMembers?.find((p) => p.person?.id === person);

  const questionInitialValues = generateEditInitialValues(
    personData,
    isMainApplicant
  );

  const initialValues = {
    ...questionInitialValues,
    personalDetails_title: personData?.person?.title,
    personalDetails_firstName: personData?.person?.firstName,
    personalDetails_surname: personData?.person?.surname,
    personalDetails_dateOfBirth: personData?.person?.dateOfBirth,
    personalDetails_gender: personData?.person?.gender,
    personalDetails_nationalInsuranceNumber:
      personData?.person?.nationalInsuranceNumber,
    personalDetails_emailAddress: personData?.contactInformation?.emailAddress,
    personalDetails_phoneNumber: personData?.contactInformation?.phoneNumber,
  };

  const savedAddresses =
    personData?.questions?.filter(
      (question) => question.id === 'address-history/addressHistory'
    )[0]?.answer || '';

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addresses, setAddresses] = useState(
    JSON.parse(savedAddresses) as Address[]
  );

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addresses);

    const householdMemberFormData = {
      person: {
        id: person,
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
      data.otherMembers = [
        ...data.otherMembers.filter((member) => member.person?.id !== person),
        householdMemberFormData,
      ];
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

  const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
  const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
  const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
  const employmentSection = getSectionData(FormID.EMPLOYMENT);

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Edit household member">
        <HeadingOne content="Edit household member" />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Household member details
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={addCaseSchema}
        >
          {({ isSubmitting, errors, isValid }) => {
            return (
              <>
                {!isValid && isSubmitted ? (
                  <ErrorSummary title="There is a problem">
                    <ul className="govuk-list govuk-error-summary__list">
                      {Object.entries(errors).map(([inputName, errorTitle]) => (
                        <li key={inputName}>
                          <a href={`#${inputName}`}>{errorTitle}</a>
                        </li>
                      ))}
                    </ul>
                  </ErrorSummary>
                ) : null}
                <Form>
                  <AddCaseSection section={personalDetailsSection} />
                  <AddCaseSection section={immigrationStatusSection} />
                  <AddCaseSection section={medicalNeedsSection} />
                  <AddCaseAddress
                    addresses={addresses}
                    setAddresses={setAddresses}
                    maximumAddresses={1}
                  />
                  <AddCaseSection section={employmentSection} />

                  <div className="c-flex__1 text-right">
                    <Button
                      onClick={handleSaveApplication}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Update household member
                    </Button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </Layout>
    </UserContext.Provider>
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
