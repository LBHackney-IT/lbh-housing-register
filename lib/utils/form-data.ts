import addressHistory from '../../data/forms/address-history.json';
import agreementFormData from '../../data/forms/agreement.json';
import currentAccommodationFormData from '../../data/forms/current-accommodation.json';
import employment from '../../data/forms/employment.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import incomeSavings from '../../data/forms/income.json';
import medicalNeeds from '../../data/forms/medical-needs.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
import newPersonDetailsFormData from '../../data/forms/new-person-details.json';
import residentialStatusFormData from '../../data/forms/residential-status.json';
import signInVerifyFormData from '../../data/forms/sign-in-verify.json';
import signInFormData from '../../data/forms/sign-in.json';
import signUpDetailsFormData from '../../data/forms/sign-up-details.json';
import AccommodationType from '../../data/forms/Situation/accommodation-type.json';
import Arrears from '../../data/forms/Situation/arrears.json';
import Benefits from '../../data/forms/Situation/benefits.json';
import BreachOfTenancy from '../../data/forms/Situation/breach-of-tenancy.json';
import CourtOrder from '../../data/forms/Situation/court-order.json';
import DomesticViolence from '../../data/forms/Situation/domestic-violence.json';
import Homelessness from '../../data/forms/Situation/homelessness.json';
import Landlord from '../../data/forms/Situation/landlord.json';
import legalRestrictions from '../../data/forms/Situation/legal-restrictions.json';
import MedicalNeed from '../../data/forms/Situation/medical-need.json';
import OtherHousingRegister from '../../data/forms/Situation/other-housing-register.json';
import PropertyOwnership from '../../data/forms/Situation/property-ownership.json';
import PurchasingProperty from '../../data/forms/Situation/purchasing-property.json';
import RelationshipBreakdown from '../../data/forms/Situation/relationship-breakdown.json';
import SoldProperty from '../../data/forms/Situation/sold-property.json';
import Subletting from '../../data/forms/Situation/subletting.json';
import UnderOccupying from '../../data/forms/Situation/under-occupying.json';
import unspentConvictions from '../../data/forms/Situation/unspent-convictions.json';
import yourSituationFormData from '../../data/forms/your-situation.json';
import { EligibilityCriteria, MultiStepForm } from '../types/form';
import assertNever from './assertNever';
import EthnicityQuestions from '../../data/forms/ethnicity/ethnicity-questions.json';
import EthnicityCatagoryWhite from '../../data/forms/ethnicity/ethnicity-catagory-white.json';
import EthnicityCategoryAsianAsianBritish from '../../data/forms/ethnicity/ethnicity-category-asian-asian-british.json';
import EthnicityCategoryBlackBlackBritish from '../../data/forms/ethnicity/ethnicity-category-black-black-british.json';
import EthnicityCategoryMixedMultipleBackground from '../../data/forms/ethnicity/ethnicity-category-mixed-multiple-background.json';
import EthnicityCategoryOtherEthnicGroup from '../../data/forms/ethnicity/ethnicity-category-other-ethnic-group.json';

export enum FormID {
  AGREEMENT = 'agreement',
  SIGN_IN = 'sign-in',
  SIGN_IN_VERIFY = 'sign-in-verify',
  SIGN_UP_DETAILS = 'sign-up-details',
  IMMIGRATION_STATUS = 'immigration-status',
  PERSONAL_DETAILS = 'personal-details',
  NEW_PERSON_DETAILS = 'add-person',
  CURRENT_ACCOMMODATION = 'current-accommodation',
  YOUR_SITUATION = 'your-situation',
  RESIDENTIAL_STATUS = 'residential-status',
  ADDRESS_HISTORY = 'address-history',
  INCOME_SAVINGS = 'income-savings',
  MEDICAL_NEEDS = 'medical-needs',
  COURT_ORDER = 'court-order',
  ACCOMODATION_TYPE = 'AccommodationType',
  DOMESTIC_VIOLENCE = 'domestic-violence',
  HOMELESSESS = 'homelessness',
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
  LEAGLE_RESTRICTIONS = 'legal-restrictions',
  UNSPENT_CONVICTIONS = 'unspent-convictions',
  EMPLOYMENT = 'employment',
  ETHNICITY_QUESTIONS = 'ethnicity-questions',
  ETHNICITY_CATAGORY_WHITE = 'ethnicity-catagory-white',
  ETHNICITY_CATAGORY_ASIAN_ASIAN_BRITISH = 'ethnicity-category-asian-asian-british',
  ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH = 'ethnicity-category-black-black-british',
  ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND = 'ethnicity-category-mixed-multiple-background',
  ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP = 'ethnicity-category-other-ethnic-group',
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

    case FormID.IMMIGRATION_STATUS:
      return immigrationStatusFormData as MultiStepForm;

    case FormID.PERSONAL_DETAILS:
      return personalDetailsFormData as MultiStepForm;

    case FormID.NEW_PERSON_DETAILS:
      return newPersonDetailsFormData as MultiStepForm;

    case FormID.CURRENT_ACCOMMODATION:
      return currentAccommodationFormData as MultiStepForm;

    case FormID.YOUR_SITUATION:
      return yourSituationFormData as MultiStepForm;

    case FormID.RESIDENTIAL_STATUS:
      return residentialStatusFormData as MultiStepForm;

    case FormID.ADDRESS_HISTORY:
      return addressHistory as MultiStepForm;

    case FormID.INCOME_SAVINGS:
      return incomeSavings as MultiStepForm;

    case FormID.MEDICAL_NEEDS:
      return medicalNeeds as MultiStepForm;

    case FormID.COURT_ORDER:
      return CourtOrder as MultiStepForm;

    case FormID.ACCOMODATION_TYPE:
      return AccommodationType as MultiStepForm;

    case FormID.DOMESTIC_VIOLENCE:
      return DomesticViolence as MultiStepForm;

    case FormID.HOMELESSESS:
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

    case FormID.LEAGLE_RESTRICTIONS:
      return legalRestrictions as MultiStepForm;

    case FormID.UNSPENT_CONVICTIONS:
      return unspentConvictions as MultiStepForm;

    case FormID.EMPLOYMENT:
      return employment as MultiStepForm;

    case FormID.ETHNICITY_QUESTIONS:
      return EthnicityQuestions as MultiStepForm;

    case FormID.ETHNICITY_CATAGORY_WHITE:
      return EthnicityCatagoryWhite as MultiStepForm;

    case FormID.ETHNICITY_CATAGORY_ASIAN_ASIAN_BRITISH:
      return EthnicityCategoryAsianAsianBritish as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH:
      return EthnicityCategoryBlackBlackBritish as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND:
      return EthnicityCategoryMixedMultipleBackground as MultiStepForm;

    case FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP:
      return EthnicityCategoryOtherEthnicGroup as MultiStepForm;

    default:
      return assertNever(form, 'Unknown form step: ' + form);
  }
}
