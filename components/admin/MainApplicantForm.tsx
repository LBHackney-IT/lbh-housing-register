import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { UserContext } from '../../lib/contexts/user-context';
import Button from '../../components/button';
import ErrorSummary from '../../components/errors/error-summary';
import { FormID } from '../../lib/utils/form-data';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Application } from '../../domain/HousingApi';
import {
  allFormSections,
  getSectionData,
  generateInitialValues,
  generateEditInitialValues,
  mainApplicantSchema,
} from '../../lib/utils/adminHelpers';
import AddCaseSection from '../../components/admin/AddCaseSection';
import AddCaseAddress from '../../components/admin/AddCaseAddress';
import Layout from '../../components/layout/staff-layout';
import { HeadingOne } from '../../components/content/headings';

const keysToOmit = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

const sections = allFormSections(keysToOmit);

const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
const residentialStatusSection = getSectionData(FormID.RESIDENTIAL_STATUS);
const currentAccommodationSection = getSectionData(
  FormID.CURRENT_ACCOMMODATION
);
const currentAccommodationHostSection = getSectionData(
  FormID.CURRENT_ACCOMMODATION_HOST_DETAILS
);
const currentAccommodationLandlordSection = getSectionData(
  FormID.CURRENT_ACCOMMODATION_LANDLORD_DETAILS
);
const armedForcesSection = getSectionData(FormID.SITUATION_ARMED_FORCES);
const courtOrderSection = getSectionData(FormID.COURT_ORDER);
const accomodationTypeSection = getSectionData(FormID.ACCOMODATION_TYPE);
const domesticViolenceSection = getSectionData(FormID.DOMESTIC_VIOLENCE);
const homelessnessSection = getSectionData(FormID.HOMELESSNESS);
const sublettingSection = getSectionData(FormID.SUBLETTING);
const medicalNeedSection = getSectionData(FormID.MEDICAL_NEED);
const purchasingPropertySection = getSectionData(FormID.PURCHASING_PROPERTY);
const propertyOwnwershipSection = getSectionData(FormID.PROPERTY_OWNERSHIP);
const soldPropertySection = getSectionData(FormID.SOLD_PROPERTY);
const arrearsSection = getSectionData(FormID.ARREARS);
const breachOfTenancySection = getSectionData(FormID.BREACH_OF_TENANCY);
const legalRestrictionsSection = getSectionData(FormID.LEGAL_RESTRICTIONS);
const unspentConvictionsSection = getSectionData(FormID.UNSPENT_CONVICTIONS);
const employmentSection = getSectionData(FormID.EMPLOYMENT);
const incomeSavingsSection = getSectionData(FormID.INCOME_SAVINGS);
const ethnicitySection = getSectionData(FormID.ETHNICITY_QUESTIONS);

interface PageProps {
  isEditing: boolean;
  user: HackneyGoogleUser;
  onSubmit: (values: FormikValues) => void;
  isSubmitted: boolean;
  addressHistory: any;
  setAddressHistory: (addresses: any) => void;
  handleSaveApplication: (isValid: boolean, touched: {}) => void;
  data?: Application;
}

export default function MainApplicantForm({
  isEditing,
  user,
  onSubmit,
  isSubmitted,
  addressHistory,
  setAddressHistory,
  handleSaveApplication,
  data,
}: PageProps) {
  const initialValues = isEditing
    ? generateEditInitialValues(data, true)
    : generateInitialValues(sections);

  const isEditingCopy = isEditing ? 'Edit' : 'Add new';
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName={`${isEditingCopy} case`}>
        <HeadingOne content={`${isEditingCopy} case`} />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Main applicant details
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={mainApplicantSchema}
        >
          {({ touched, isSubmitting, errors, isValid }) => {
            const isTouched = Object.keys(touched).length !== 0;
            return (
              <>
                {!isValid && isTouched && isSubmitted ? (
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
                  <AddCaseSection section={currentAccommodationHostSection} />
                  <AddCaseSection
                    section={currentAccommodationLandlordSection}
                  />

                  {/* Your situation */}
                  <AddCaseSection section={armedForcesSection} />
                  <AddCaseSection section={courtOrderSection} />
                  <AddCaseSection section={accomodationTypeSection} />
                  <AddCaseSection section={domesticViolenceSection} />

                  <AddCaseSection section={homelessnessSection} />
                  <AddCaseSection section={sublettingSection} />
                  <AddCaseSection section={medicalNeedSection} />
                  <AddCaseSection section={purchasingPropertySection} />
                  <AddCaseSection section={propertyOwnwershipSection} />
                  <AddCaseSection section={soldPropertySection} />
                  <AddCaseSection section={arrearsSection} />
                  <AddCaseSection section={breachOfTenancySection} />
                  <AddCaseSection section={legalRestrictionsSection} />
                  <AddCaseSection section={unspentConvictionsSection} />

                  <AddCaseSection section={employmentSection} />
                  <AddCaseSection section={incomeSavingsSection} />
                  <AddCaseSection section={ethnicitySection} />

                  {/* <AddCaseEthnicitySection  /> */}

                  <div className="c-flex__1 text-right">
                    <Button
                      onClick={() => handleSaveApplication(isValid, touched)}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isEditing
                        ? 'Update application'
                        : 'Save new application'}
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
