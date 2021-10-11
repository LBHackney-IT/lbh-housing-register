import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import { getFormData, FormID } from '../../lib/utils/form-data';
import AllFormFieldsMarkup from '../../components/admin/AllFormFieldsMarkup';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  generateInitialValues,
} from '../../lib/utils/adminHelpers';

const keysToIgnore = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const onSubmit = (values: FormikValues) => {
    console.log(FormID.ACCOMODATION_TYPE);

    // const test = getQuestionsForFormAsValues(FormID.ACCOMODATION_TYPE);

    console.log('submitted: ', values);
    const request: Application = {
      id: '123345678910',
      reference: '31a1de3271',
      status: 'New',
      sensitiveData: true,
      assignedTo: 'thomas.morris@hackney.gov.uk',
      createdAt: '2021-09-14T19:23:42.7573803Z',
      mainApplicant: {
        person: {},
        address: {},
        contactInformation: {},
        questions: [],
      },
      otherMembers: [],
    };
    // console.log(request);

    // createApplication(request);
    // router.reload();
  };

  // const schema = Yup.object({
  //   status: Yup.string()
  //     .label('Status')
  //     .required()
  //     .oneOf(statusOptions.map(({ value }) => value)),
  //   reason: Yup.string()
  //     .label('Reason')
  //     .oneOf(reasonOptions.map(({ value }) => value)),
  //   applicationDate: Yup.string(),
  //   informationReceived: Yup.string(),
  //   band: Yup.string(),
  //   biddingNumberType: Yup.string().oneOf(['generate', 'manual']),
  //   biddingNumber: Yup.string(),
  // });

  const initialValues = {
    personalDetails_title: '',
    personalDetails_firstName: '',
    personalDetails_surname: '',
    personalDetails_dateOfBirth: '',
    personalDetails_gender: '',
    personalDetails_nationalInsuranceNumber: '',
    personalDetails_phoneNumber: '',
    personalDetails_emailAddress: '',
    immigrationStatus_citizenship: '',
    immigrationStatus_ukStudying: '',
    immigrationStatus_settledStatus: '',
    immigrationStatus_workOrStudyVisa: '',
    immigrationStatus_eeaNational: '',
    immigrationStatus_receivingSponsorship: '',
    immigrationStatus_legalStatus: '',
    residentialStatus_residentialStatus: '',
    residentialStatus_movedBorough: '',
    residentialStatus_homeless: '',
    residentialStatus_asboBehaviour: '',
    residentialStatus_armedForces: '',
    residentialStatus_mobilityScheme: '',
    residentialStatus_homelessnessAccepted: '',
    residentialStatus_socialHousing: '',
    residentialStatus_workInHackney: '',
    residentialStatus_providingCare: '',
    residentialStatus_domesticViolence: '',
    residentialStatus_studyingOutsideBorough: '',
    residentialStatus_institutions: '',
    addressHistory_addressFinder: '',
    currentAccommodation_livingSituation: '',
    currentAccommodation_home: '',
    currentAccommodation_homeFloor: '',
    currentAccommodation_homeHowManyPeopleShare: '',
    currentAccommodation_homeHowManyBedrooms: '',
    currentAccommodation_homeHowManyLivingrooms: '',
    currentAccommodation_homeHowManyDiningrooms: '',
    currentAccommodation_homeHowManyBathrooms: '',
    currentAccommodation_homeHowManyKitchens: '',
    currentAccommodation_homeHowManyOtherRooms: '',
    currentAccommodation_whyHomeUnsuitable: '',
    currentAccommodationHostDetails_hostPersonName: '',
    currentAccommodationHostDetails_hostPersonNumber: '',
    currentAccommodationLandlordDetails_landlordName: '',
    employment_employment: '',
    employment_addressFinder: '',
    employment_courseCompletionDate: '',
    employment_proofOfIncomeEmployeed: '',
    employment_proofOfIncomeSelfEmployeed: '',
    employment_proofOfIncomeRetired: '',
    incomeSavings_income: '',
    incomeSavings_savings: '',
    medicalNeeds_medicalNeeds: '',
    medicalNeeds_proofOfMedicalNeeds: '',
    yourSituation_yourSituation: '',
    situationArmedForces_situationArmedForces: '',
    courtOrder_courtOrder: '',
    courtOrder_details: '',
    accommodationType_accommodationType: '',
    domesticViolence_domesticViolence: '',
    homelessness_homelessness: '',
    subletting_subletting: '',
    medicalNeed_medicalNeed: '',
    purchasingProperty_purchasingProperty: '',
    propertyOwnership_propertyOwnership: '',
    soldProperty_soldProperty: '',
    relationshipBreakdown_relationshipBreakdown: '',
    arrears_arrears: '',
    underOccupying_underOccupying: '',
    benefits_benefits: '',
    landlord_landlord: '',
    otherHousingRegister_otherHousingRegister: '',
    breachOfTenancy_breachOfTenancy: '',
    breachOfTenancy_details: '',
    legalRestrictions_legalRestrictions: '',
    legalRestrictions_details: '',
    unspentConvictions_unspentConvictions: '',
    unspentConvictions_details: '',
    additionalQuestions_householdInfo: '',
    additionalQuestions_householdDetails: '',
    ethnicityQuestions_ethnicityMainCategory: '',
    ethnicityExtendedCategoryAsianAsianBritish_ethnicityExtendedCategory: '',
    ethnicityExtendedCategoryBlackBlackBritish_ethnicityExtendedCategory: '',
    ethnicityExtendedCategoryMixedMultipleBackground_ethnicityExtendedCategory:
      '',
    ethnicityExtendedCategoryWhite_ethnicityExtendedCategory: '',
    ethnicityExtendedCategoryOtherEthnicGroup_ethnicityExtendedCategory: '',
    adminHealthActions_linkToMedicalForm: '',
    adminHealthActions_dateFormRecieved: '',
    adminHealthActions_assessmentDate: '',
    adminHealthActions_outcome: '',
    adminHealthActions_accessibleHousingRegister: '',
    adminHealthActions_disability: '',
    adminHealthActions_additionalInformation: '',
  };

  // console.log(allFormSections(keysToIgnore));

  const sections = allFormSections(keysToIgnore);

  // THIS NEEDS TO RETURN IN THE FORMAT ABOVE
  const flatSections = generateInitialValues(sections);
  // console.log(flatSections);

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {sections.map((section, index) => (
                <AllFormFieldsMarkup
                  key={index}
                  sectionHeading={section.sectionHeading}
                  sectionId={section.sectionId}
                  sectionData={section.fields}
                />
              ))}

              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  Save new Application
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Layout>
    </UserContext.Provider>
  );
}
