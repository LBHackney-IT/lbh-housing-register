import React, { useState, SyntheticEvent } from 'react';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { getRedirect, getSession } from '../../../../lib/utils/googleAuth';
import { HackneyGoogleUser } from '../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../domain/HousingApi';
import { getApplication } from '../../../../lib/gateways/applications-api';
import { UserContext } from '../../../../lib/contexts/user-context';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { updateApplication } from '../../../../lib/gateways/internal-api';
import {
  getSectionData,
  generateInitialValues,
  generateQuestionArray,
  Address,
  addCaseSchema,
} from '../../../../lib/utils/adminHelpers';
import { FormID } from '../../../../lib/utils/form-data';
import { scrollToTop } from '../../../../lib/utils/scroll';
import Layout from '../../../../components/layout/staff-layout';
import AddCaseSection from '../../../../components/admin/AddCaseSection';
import AddCaseAddress from '../../../../components/admin/AddCaseAddress';
import { HeadingOne } from '../../../../components/content/headings';
import Button from '../../../../components/button';
import ErrorSummary from '../../../../components/errors/error-summary';
import Custom404 from '../../../404';

const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
const addressHistorySection = getSectionData(FormID.ADDRESS_HISTORY);
const employmentSection = getSectionData(FormID.EMPLOYMENT);

const initialValues = generateInitialValues([
  personalDetailsSection,
  immigrationStatusSection,
  medicalNeedsSection,
  addressHistorySection,
  employmentSection,
]);

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddHouseholdMember({
  user,
  data,
}: PageProps): JSX.Element | null {
  if (!data.id) return <Custom404 />;

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
      address: addresses[0] || null,
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
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Add household member">
        <HeadingOne content="Add new case" />
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
                      Save household member
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
