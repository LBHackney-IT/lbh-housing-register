import addressHistory from '../../data/forms/address-history.json';
import agreementFormData from '../../data/forms/agreement.json';
import currentAccommodationFormData from '../../data/forms/current_accommodation/current-accommodation.json';
import currentAccommodationHostDetails from '../../data/forms/current_accommodation/current-accommodation-host-details.json';
import currentAccommodationLandlordDetails from '../../data/forms/current_accommodation/current-accommodation-landlord-details.json';
import declarationFormData from '../../data/forms/declaration.json';
import employment from '../../data/forms/employment.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import incomeSavings from '../../data/forms/income.json';
import medicalNeeds from '../../data/forms/medical-needs.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
import residentialStatusFormData from '../../data/forms/residential-status.json';
import signInVerifyFormData from '../../data/forms/sign-in-verify.json';
import signInFormData from '../../data/forms/sign-in.json';
import signUpDetailsFormData from '../../data/forms/sign-up-details.json';

import yourSituationFormData from '../../data/forms/your-situation.json';
import AccommodationType from '../../data/forms/Situation/accommodation-type.json';
import Arrears from '../../data/forms/Situation/arrears.json';
import Benefits from '../../data/forms/Situation/benefits.json';
import BreachOfTenancy from '../../data/forms/Situation/breach-of-tenancy.json';
import ArmedForces from '../../data/forms/Situation/situation-armed-forces.json';
import CourtOrder from '../../data/forms/Situation/court-order.json';
import DomesticViolence from '../../data/forms/Situation/domestic-violence.json';
import Homelessness from '../../data/forms/Situation/homelessness.json';
import Landlord from '../../data/forms/Situation/landlord.json';
import LegalRestrictions from '../../data/forms/Situation/legal-restrictions.json';
import MedicalNeed from '../../data/forms/Situation/medical-need.json';
import OtherHousingRegister from '../../data/forms/Situation/other-housing-register.json';
import PropertyOwnership from '../../data/forms/Situation/property-ownership.json';
import PurchasingProperty from '../../data/forms/Situation/purchasing-property.json';
import RelationshipBreakdown from '../../data/forms/Situation/relationship-breakdown.json';
import SoldProperty from '../../data/forms/Situation/sold-property.json';
import Subletting from '../../data/forms/Situation/subletting.json';
import UnderOccupying from '../../data/forms/Situation/under-occupying.json';
import UnspentConvictions from '../../data/forms/Situation/unspent-convictions.json';

import AdditionalQuestions from '../../data/forms/additional-questions.json';
import EthnicityQuestions from '../../data/forms/ethnicity/ethnicity-questions.json';
import EthnicityCategoryAsianAsianBritish from '../../data/forms/ethnicity/ethnicity-category-asian-asian-british.json';
import EthnicityCategoryBlackBlackBritish from '../../data/forms/ethnicity/ethnicity-category-black-black-british.json';
import EthnicityCategoryMixedMultipleBackground from '../../data/forms/ethnicity/ethnicity-category-mixed-multiple-background.json';
import EthnicityCategoryWhite from '../../data/forms/ethnicity/ethnicity-category-white.json';
import EthnicityCategoryOtherEthnicGroup from '../../data/forms/ethnicity/ethnicity-category-other-ethnic-group.json';

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
  ARMED_FORCES = 'situation-armed-forces',
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

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiStepForm}
 */
export function getFormData(form: FormID): MultiStepForm {
  switch (form) {
    case FormID.AGREEMENT:
      return agreementFormData as MultiStepForm;

    case FormID.SIGN_IN:
      return signInFormData as MultiStepForm;

    case FormID.SIGN_IN_VERIFY:
      return signInVerifyFormData as MultiStepForm;

    case FormID.SIGN_UP_DETAILS:
      return signUpDetailsFormData as MultiStepForm;

    case FormID.PERSONAL_DETAILS:
      return personalDetailsFormData as MultiStepForm;

    case FormID.IMMIGRATION_STATUS:
      return immigrationStatusFormData as MultiStepForm;

    case FormID.RESIDENTIAL_STATUS:
      return residentialStatusFormData as MultiStepForm;

    case FormID.ADDRESS_HISTORY:
      return addressHistory as MultiStepForm;

    case FormID.CURRENT_ACCOMMODATION:
      return currentAccommodationFormData as MultiStepForm;

    case FormID.EMPLOYMENT:
      return employment as MultiStepForm;

    case FormID.INCOME_SAVINGS:
      return incomeSavings as MultiStepForm;

    case FormID.MEDICAL_NEEDS:
      return medicalNeeds as MultiStepForm;

    // your situation
    case FormID.ARMED_FORCES:
      return ArmedForces as MultiStepForm;

    case FormID.COURT_ORDER:
      return CourtOrder as MultiStepForm;

    case FormID.ACCOMODATION_TYPE:
      return AccommodationType as MultiStepForm;

    case FormID.DOMESTIC_VIOLENCE:
      return DomesticViolence as MultiStepForm;

    case FormID.HOMELESSNESS:
      return Homelessness as MultiStepForm;

    case FormID.SUBLETTING:
      return Subletting as MultiStepForm;

    case FormID.MEDICAL_NEED:
      return MedicalNeed as MultiStepForm;

    case FormID.PURCHASING_PROPERTY:
      return PurchasingProperty as MultiStepForm;

    case FormID.PROPERTY_OWNERSHIP:
      return PropertyOwnership as MultiStepForm;

    case FormID.SOLD_PROPERTY:
      return SoldProperty as MultiStepForm;

    case FormID.RELATIONSHIP_BREAKDOWN:
      return RelationshipBreakdown as MultiStepForm;

    case FormID.ARREARS:
      return Arrears as MultiStepForm;

    case FormID.UNDER_OCCUPYING:
      return UnderOccupying as MultiStepForm;

    case FormID.BENEFITS:
      return Benefits as MultiStepForm;

    case FormID.LANDLORD:
      return Landlord as MultiStepForm;

    case FormID.OTHER_HOUSING_REGISTER:
      return OtherHousingRegister as MultiStepForm;

    case FormID.BREACH_OF_TENANCY:
      return BreachOfTenancy as MultiStepForm;

    case FormID.LEGAL_RESTRICTIONS:
      return LegalRestrictions as MultiStepForm;

    case FormID.UNSPENT_CONVICTIONS:
      return UnspentConvictions as MultiStepForm;

    // additional questions
    case FormID.ADDITIONAL_QUESTIONS:
      return AdditionalQuestions as MultiStepForm;

    case FormID.ETHNICITY_QUESTIONS:
      return EthnicityQuestions as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH:
      return EthnicityCategoryAsianAsianBritish as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH:
      return EthnicityCategoryBlackBlackBritish as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND:
      return EthnicityCategoryMixedMultipleBackground as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_WHITE:
      return EthnicityCategoryWhite as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP:
      return EthnicityCategoryOtherEthnicGroup as MultiStepForm;

    case FormID.CURRENT_ACCOMMODATION_HOST_DETAILS:
      return currentAccommodationHostDetails as MultiStepForm;

    case FormID.CURRENT_ACCOMMODATION_LANDLORD_DETAILS:
      return currentAccommodationLandlordDetails as MultiStepForm;

    // this form isn't used anywhere
    case FormID.YOUR_SITUATION:
      return yourSituationFormData as MultiStepForm;

    case FormID.DECLARATION:
      return declarationFormData as MultiStepForm;

    default:
      return assertNever(form, 'Unknown form step: ' + form);
  }
}
