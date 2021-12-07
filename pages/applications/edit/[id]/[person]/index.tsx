import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Form, Formik, FormikValues } from 'formik';
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
  mainApplicantSchema,
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
  evidenceLink,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;
  const router = useRouter();
  const isMainApplicant = data.mainApplicant?.person?.id === person;

  const questionInitialValues = generateEditInitialValues(
    data,
    isMainApplicant
  );

  const initialValues = {
    ...questionInitialValues,
    personalDetails_title: data.mainApplicant?.person?.title,
    personalDetails_firstName: data.mainApplicant?.person?.firstName,
    personalDetails_surname: data.mainApplicant?.person?.surname,
    personalDetails_dateOfBirth: data.mainApplicant?.person?.dateOfBirth,
    personalDetails_gender: data.mainApplicant?.person?.gender,
    personalDetails_nationalInsuranceNumber:
      data.mainApplicant?.person?.nationalInsuranceNumber,
    personalDetails_emailAddress:
      data.mainApplicant?.contactInformation?.emailAddress,
    personalDetails_phoneNumber:
      data.mainApplicant?.contactInformation?.phoneNumber,
  };

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
        address: addressHistory[0].address || null,
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
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
      <Layout pageName="Edit case">
        <HeadingOne content="Edit case" />
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
                      Update application
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
