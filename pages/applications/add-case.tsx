import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  getSectionData,
  generateInitialValues,
  generateQuestionArray,
  Address,
  mainApplicantSchema,
} from '../../lib/utils/adminHelpers';
import { ApplicationStatus } from '../../lib/types/application-status';
import { FormID } from '../../lib/utils/form-data';
import AddCaseSection from '../../components/admin/AddCaseSection';
import AddCaseAddress from '../../components/admin/AddCaseAddress';
import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import Button from '../../components/button';
import ErrorSummary from '../../components/errors/error-summary';
import { HeadingOne } from '../../components/content/headings';
import { scrollToTop } from '../../lib/utils/scroll';

const keysToOmit = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

const sections = allFormSections(keysToOmit);
const initialValues = generateInitialValues(sections);

interface PageProps {
  user: HackneyGoogleUser;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const router = useRouter();
  const [addressHistory, setAddressHistory] = useState([] as Address[]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addressHistory);

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
        address: addressHistory[0].address || null,
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
      otherMembers: [],
      assignedTo: user.email,
    };

    createApplication(request);
    setTimeout(
      () =>
        router.push({
          pathname: '/applications/view-register',
          query: { status: ApplicationStatus.MANUAL_DRAFT },
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
  const residentialStatusSection = getSectionData(FormID.RESIDENTIAL_STATUS);
  const currentAccommodationSection = getSectionData(
    FormID.CURRENT_ACCOMMODATION
  );
  const armedForcesSection = getSectionData(FormID.SITUATION_ARMED_FORCES);
  const homelessnessSection = getSectionData(FormID.HOMELESSNESS);
  const propertyOwnwershipSection = getSectionData(FormID.PROPERTY_OWNERSHIP);
  const soldPropertySection = getSectionData(FormID.SOLD_PROPERTY);
  const arrearsSection = getSectionData(FormID.ARREARS);
  const breachOfTenancySection = getSectionData(FormID.BREACH_OF_TENANCY);
  const legalRestrictionsSection = getSectionData(FormID.LEGAL_RESTRICTIONS);
  const unspentConvictionsSection = getSectionData(FormID.UNSPENT_CONVICTIONS);
  const employmentSection = getSectionData(FormID.EMPLOYMENT);
  const incomeSavingsSection = getSectionData(FormID.INCOME_SAVINGS);

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <HeadingOne content="Add new case" />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Main applicant details
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={mainApplicantSchema}
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
                  <AddCaseSection section={residentialStatusSection} />
                  <AddCaseAddress
                    addresses={addressHistory}
                    setAddresses={setAddressHistory}
                  />
                  <AddCaseSection section={currentAccommodationSection} />

                  {/* Your situation */}
                  <AddCaseSection section={armedForcesSection} />
                  <AddCaseSection section={homelessnessSection} />
                  <AddCaseSection section={propertyOwnwershipSection} />
                  <AddCaseSection section={soldPropertySection} />
                  <AddCaseSection section={arrearsSection} />
                  <AddCaseSection section={breachOfTenancySection} />
                  <AddCaseSection section={legalRestrictionsSection} />
                  <AddCaseSection section={unspentConvictionsSection} />

                  <AddCaseSection section={employmentSection} />
                  <AddCaseSection section={incomeSavingsSection} />

                  <div className="c-flex__1 text-right">
                    <Button
                      onClick={handleSaveApplication}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Save new application
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

  return { props: { user } };
};
