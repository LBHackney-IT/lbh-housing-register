import addressHistory from '../../data/forms/addressHistory';
import agreementFormData from '../../data/forms/agreement';
import currentAccommodationFormData from '../../data/forms/current_accommodation/currentAccommodation';
import currentAccommodationHostDetails from '../../data/forms/current_accommodation/currentAccommodationHostDetails';
import currentAccommodationLandlordDetails from '../../data/forms/current_accommodation/currentAccommodationLandlordDetails';
import declarationFormData from '../../data/forms/declaration';
import employment from '../../data/forms/employment';
import immigrationStatusFormData from '../../data/forms/immigrationStatus';
import incomeSavings from '../../data/forms/income';
import medicalNeeds from '../../data/forms/medicalNeeds';
import personalDetailsFormData from '../../data/forms/personDetails';
import residentialStatusFormData from '../../data/forms/residentialStatus';
import signInVerifyFormData from '../../data/forms/signInVerify';
import signInFormData from '../../data/forms/signIn';
import signUpDetailsFormData from '../../data/forms/signUpDetails';
import yourSituationFormData from '../../data/forms/yourSituation';
import AccommodationType from '../../data/forms/Situation/accommodationType';
import Arrears from '../../data/forms/Situation/arrears';
import Benefits from '../../data/forms/Situation/benefits';
import BreachOfTenancy from '../../data/forms/Situation/breachOfTenancy';
import ArmedForces from '../../data/forms/Situation/situationArmedForces';
import CourtOrder from '../../data/forms/Situation/courtOrder';
import DomesticViolence from '../../data/forms/Situation/domesticViolence';
import Homelessness from '../../data/forms/Situation/homelessness';
import Landlord from '../../data/forms/Situation/landlord';
import LegalRestrictions from '../../data/forms/Situation/legalRestrictions';
import MedicalNeed from '../../data/forms/Situation/medicalNeed';
import OtherHousingRegister from '../../data/forms/Situation/otherHousingRegister';
import PropertyOwnership from '../../data/forms/Situation/propertyOwnership';
import PurchasingProperty from '../../data/forms/Situation/purchasingProperty';
import RelationshipBreakdown from '../../data/forms/Situation/relationshipBreakdown';
import SoldProperty from '../../data/forms/Situation/soldProperty';
import Subletting from '../../data/forms/Situation/subletting';
import UnderOccupying from '../../data/forms/Situation/underOccupying';
import UnspentConvictions from '../../data/forms/Situation/unspentConvictions';
import AdditionalQuestions from '../../data/forms/additionalQuestions';
import EthnicityQuestions from '../../data/forms/ethnicity/ethnicityQuestions';
import {
  ethnicCategoryAsianAsianBritishForm,
  ethnicCategoryBlackBlackBritishForm,
  ethnicCategoryMixedMultipleBackgroundForm,
  ethnicCategoryWhiteForm,
  ethnicCategoryOtherEthnicGroupForm,
} from './extendedEthnicityData';

import { EligibilityCriteria, MultiStepForm } from '../types/form';
import assertNever from './assertNever';

export enum FormID {
  AGREEMENT = 'agreement',
  SIGN_IN = 'sign-in',
  SIGN_IN_VERIFY = 'sign-in-verify',
  SIGN_UP_DETAILS = 'sign-up-details',
  PERSONAL_DETAILS = 'personal-details',
  IMMIGRATION_STATUS = 'immigration-status',
  RESIDENTIAL_STATUS = 'residential-status',
  ADDRESS_HISTORY = 'address-history',
  CURRENT_ACCOMMODATION = 'current-accommodation',
  CURRENT_ACCOMMODATION_HOST_DETAILS = 'current-accommodation-host-details',
  CURRENT_ACCOMMODATION_LANDLORD_DETAILS = 'current-accommodation-landlord-details',
  EMPLOYMENT = 'employment',
  INCOME_SAVINGS = 'income-savings',
  MEDICAL_NEEDS = 'medical-needs',
  YOUR_SITUATION = 'your-situation',
  SITUATION_ARMED_FORCES = 'situation-armed-forces',
  COURT_ORDER = 'court-order',
  ACCOMODATION_TYPE = 'accommodation-type',
  DOMESTIC_VIOLENCE = 'domestic-violence',
  HOMELESSNESS = 'homelessness',
  SUBLETTING = 'subletting',
  MEDICAL_NEED = 'medical-need',
  PURCHASING_PROPERTY = 'purchasing-property',
  PROPERTY_OWNERSHIP = 'property-ownership',
  SOLD_PROPERTY = 'sold-property',
  RELATIONSHIP_BREAKDOWN = 'relationship-breakdown',
  ARREARS = 'arrears',
  UNDER_OCCUPYING = 'under-occupying',
  BENEFITS = 'benefits',
  LANDLORD = 'landlord',
  OTHER_HOUSING_REGISTER = 'other-housing-register',
  BREACH_OF_TENANCY = 'breach-of-tenancy',
  LEGAL_RESTRICTIONS = 'legal-restrictions',
  UNSPENT_CONVICTIONS = 'unspent-convictions',
  ADDITIONAL_QUESTIONS = 'additional-questions',
  ETHNICITY_QUESTIONS = 'ethnicity-questions',
  ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH = 'ethnicity-extended-category-asian-asian-british',
  ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH = 'ethnicity-extended-category-black-black-british',
  ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND = 'ethnicity-extended-category-mixed-multiple-background',
  ETHNICITY_CATEGORY_WHITE = 'ethnicity-extended-category-white',
  ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP = 'ethnicity-extended-category-other-ethnic-group',
  DECLARATION = 'declaration',
  _TEST_FORM = '_test-form',
}

/**
 * Get the eligibility criteria from the requested form
 * @param {string} formId - The requested eligibility criteria
 * @returns {EligibilityCriteria}
 */
export function getEligibilityCriteria(
  formId: FormID
): EligibilityCriteria[] | undefined {
  const formData = getFormData(formId);
  return formData?.eligibility;
}

function isForm(form: any): form is MultiStepForm {

  foreach (eleigibilty criteria)

    check that they're a key of the disqualification criteria

    if not return false.


  if (form.id)

  if form


  return true;
}

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiStepForm}
 */
export function getFormData(form: FormID): MultiStepForm {
  switch (form) {
    case FormID.AGREEMENT:
      return agreementFormData;

    case FormID.SIGN_IN:
      return signInFormData;

    case FormID.SIGN_IN_VERIFY:
      return signInVerifyFormData;

    case FormID.SIGN_UP_DETAILS:
      return signUpDetailsFormData;

    case FormID.PERSONAL_DETAILS:
      return personalDetailsFormData;

    case FormID.IMMIGRATION_STATUS:
      return immigrationStatusFormData;

    case FormID.RESIDENTIAL_STATUS:
      return residentialStatusFormData;

    case FormID.ADDRESS_HISTORY:
      return addressHistory;

    case FormID.CURRENT_ACCOMMODATION:
      return currentAccommodationFormData;

    case FormID.EMPLOYMENT:
      return employment;

    case FormID.INCOME_SAVINGS:
      return incomeSavings;

    case FormID.MEDICAL_NEEDS:
      return medicalNeeds;

    // your situation
    case FormID.SITUATION_ARMED_FORCES:
      return ArmedForces;

    case FormID.COURT_ORDER:
      return CourtOrder;

    case FormID.ACCOMODATION_TYPE:
      return AccommodationType;

    case FormID.DOMESTIC_VIOLENCE:
      return DomesticViolence;

    case FormID.HOMELESSNESS:
      return Homelessness;

    case FormID.SUBLETTING:
      return Subletting;

    case FormID.MEDICAL_NEED:
      return MedicalNeed;

    case FormID.PURCHASING_PROPERTY:
      return PurchasingProperty;

    case FormID.PROPERTY_OWNERSHIP:
      return PropertyOwnership;

    case FormID.SOLD_PROPERTY:
      return SoldProperty;

    case FormID.RELATIONSHIP_BREAKDOWN:
      return RelationshipBreakdown;

    case FormID.ARREARS:
      return Arrears;

    case FormID.UNDER_OCCUPYING:
      return UnderOccupying;

    case FormID.BENEFITS:
      return Benefits;

    case FormID.LANDLORD:
      return Landlord;

    case FormID.OTHER_HOUSING_REGISTER:
      return OtherHousingRegister;

    case FormID.BREACH_OF_TENANCY:
      return BreachOfTenancy;

    case FormID.LEGAL_RESTRICTIONS:
      return LegalRestrictions;

    case FormID.UNSPENT_CONVICTIONS:
      return UnspentConvictions;

    // additional questions
    case FormID.ADDITIONAL_QUESTIONS:
      return AdditionalQuestions;

    case FormID.ETHNICITY_QUESTIONS:
      return EthnicityQuestions;

    case FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH:
      return ethnicCategoryAsianAsianBritishForm;

    case FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH:
      return ethnicCategoryBlackBlackBritishForm;

    case FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND:
      return ethnicCategoryMixedMultipleBackgroundForm;

    case FormID.ETHNICITY_CATEGORY_WHITE:
      return ethnicCategoryWhiteForm;

    case FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP:
      return ethnicCategoryOtherEthnicGroupForm;

    case FormID.CURRENT_ACCOMMODATION_HOST_DETAILS:
      return currentAccommodationHostDetails;

    case FormID.CURRENT_ACCOMMODATION_LANDLORD_DETAILS:
      return currentAccommodationLandlordDetails;

    // this form isn't used anywhere
    case FormID.YOUR_SITUATION:
      return yourSituationFormData;

    case FormID.DECLARATION:
      return declarationFormData;

    case FormID._TEST_FORM:
      throw new Error('The test form is for testing only');

    default:
      return assertNever(form, 'Unknown form step: ' + form);
  }
}
