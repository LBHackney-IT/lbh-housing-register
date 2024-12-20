import { Form, Formik, FormikValues } from 'formik';
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
import AddCaseEthnicity from '../../components/admin/AddCaseEthnicity';
import Layout from '../../components/layout/staff-layout';
import { HeadingOne } from '../../components/content/headings';
import Loading from 'components/loading';

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
const sublettingSection = getSectionData(FormID.SUBLETTING);
const domesticViolenceSection = getSectionData(FormID.DOMESTIC_VIOLENCE);
const homelessnessSection = getSectionData(FormID.HOMELESSNESS);
const propertyOwnwershipSection = getSectionData(FormID.PROPERTY_OWNERSHIP);
const soldPropertySection = getSectionData(FormID.SOLD_PROPERTY);
const medicalNeedSection = getSectionData(FormID.MEDICAL_NEED);
const purchasingPropertySection = getSectionData(FormID.PURCHASING_PROPERTY);
const arrearsSection = getSectionData(FormID.ARREARS);
const underOccupyingSection = getSectionData(FormID.UNDER_OCCUPYING);
const otherHousingRegisterSection = getSectionData(
  FormID.OTHER_HOUSING_REGISTER
);
const breachOfTenancySection = getSectionData(FormID.BREACH_OF_TENANCY);
const legalRestrictionsSection = getSectionData(FormID.LEGAL_RESTRICTIONS);
const unspentConvictionsSection = getSectionData(FormID.UNSPENT_CONVICTIONS);

const employmentSection = getSectionData(FormID.EMPLOYMENT);
const incomeSavingsSection = getSectionData(FormID.INCOME_SAVINGS);

const ethnicitySection = getSectionData(FormID.ETHNICITY_QUESTIONS);
const ethnicityAsianSection = getSectionData(
  FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH
);
const ethnicityBlackSection = getSectionData(
  FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH
);
const ethnicityMixedSection = getSectionData(
  FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND
);
const ethnicityWhiteSection = getSectionData(FormID.ETHNICITY_CATEGORY_WHITE);
const ethnicityOtherSection = getSectionData(
  FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP
);
const additionalQuestionsSection = getSectionData(FormID.ADDITIONAL_QUESTIONS);

interface PageProps {
  isEditing: boolean;
  user: HackneyGoogleUser;
  onSubmit: (values: FormikValues) => void;
  isSubmitted: boolean;
  addressHistory: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setAddressHistory: (addresses: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  handleSaveApplication: (isValid: boolean, touched: {}) => void; // eslint-disable-line @typescript-eslint/ban-types
  ethnicity: string;
  setEthnicity: (ethnicity: string) => void;
  data?: Application;
  dataTestId?: string;
  isSaving?: boolean;
  userError?: string;
}

export default function MainApplicantForm({
  isEditing,
  user,
  onSubmit,
  isSubmitted,
  addressHistory,
  setAddressHistory,
  handleSaveApplication,
  ethnicity,
  setEthnicity,
  data,
  dataTestId,
  isSaving,
  userError,
}: PageProps) {
  const initialValues = isEditing
    ? generateEditInitialValues(data, true)
    : generateInitialValues(sections);

  const isEditingCopy = isEditing ? 'Edit' : 'Add new';
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName={`${isEditingCopy} case`} dataTestId={dataTestId}>
        <HeadingOne content={`${isEditingCopy} case`} />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Main applicant details
        </h2>
        {userError && (
          <ErrorSummary dataTestId="test-edit-main-applicant-error-summary">
            {userError}
          </ErrorSummary>
        )}
        {isSaving ? (
          <Loading text="Saving..." />
        ) : (
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
                        {Object.entries(errors).map(
                          ([inputName, errorTitle]) => (
                            <li key={inputName}>
                              <a href={`#${inputName}`}>{errorTitle}</a>
                            </li>
                          )
                        )}
                      </ul>
                    </ErrorSummary>
                  ) : null}
                  <Form>
                    {/* Identity */}
                    <AddCaseSection section={personalDetailsSection} />
                    <AddCaseSection section={immigrationStatusSection} />

                    {/* Health */}
                    <AddCaseSection section={medicalNeedsSection} />

                    {/* Living situation */}
                    <AddCaseSection section={residentialStatusSection} />
                    <AddCaseAddress
                      addresses={addressHistory}
                      setAddresses={setAddressHistory}
                    />

                    {/* Current accommodation */}
                    <AddCaseSection section={currentAccommodationSection} />
                    <AddCaseSection section={currentAccommodationHostSection} />
                    <AddCaseSection
                      section={currentAccommodationLandlordSection}
                    />

                    {/* Your situation */}
                    <AddCaseSection section={armedForcesSection} />
                    <AddCaseSection section={courtOrderSection} />
                    <AddCaseSection section={accomodationTypeSection} />
                    <AddCaseSection section={sublettingSection} />
                    <AddCaseSection section={domesticViolenceSection} />
                    <AddCaseSection section={homelessnessSection} />
                    <AddCaseSection section={propertyOwnwershipSection} />
                    <AddCaseSection section={soldPropertySection} />
                    <AddCaseSection section={medicalNeedSection} />
                    <AddCaseSection section={purchasingPropertySection} />
                    <AddCaseSection section={arrearsSection} />
                    <AddCaseSection section={underOccupyingSection} />
                    <AddCaseSection section={otherHousingRegisterSection} />
                    <AddCaseSection section={breachOfTenancySection} />
                    <AddCaseSection section={legalRestrictionsSection} />
                    <AddCaseSection section={unspentConvictionsSection} />
                    <AddCaseSection section={employmentSection} />
                    <AddCaseSection section={incomeSavingsSection} />
                    <AddCaseSection section={additionalQuestionsSection} />

                    {/* Ethnicity */}
                    {/* <AddCaseSection section={ethnicitySection} /> */}
                    <AddCaseEthnicity
                      section={ethnicitySection}
                      ethnicity={ethnicity}
                      setEthnicity={setEthnicity}
                    />

                    {ethnicity === 'asian-asian-british' ? (
                      <AddCaseSection section={ethnicityAsianSection} />
                    ) : null}

                    {ethnicity === 'black-black-british' ? (
                      <AddCaseSection section={ethnicityBlackSection} />
                    ) : null}
                    {ethnicity === 'mixed-or-multiple-background' ? (
                      <AddCaseSection section={ethnicityMixedSection} />
                    ) : null}

                    {ethnicity === 'white' ? (
                      <AddCaseSection section={ethnicityWhiteSection} />
                    ) : null}

                    {ethnicity === 'other-ethnic-group' ? (
                      <AddCaseSection section={ethnicityOtherSection} />
                    ) : null}

                    <div className="c-flex__1 text-right">
                      <Button
                        onClick={() => handleSaveApplication(isValid, touched)}
                        disabled={isSubmitting}
                        type="submit"
                        dataTestId="test-submit-main-applicant-button"
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
        )}
      </Layout>
    </UserContext.Provider>
  );
}
