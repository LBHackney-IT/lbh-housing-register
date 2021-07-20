import agreementFormData from '../../data/forms/agreement.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
import addressDetailsFormData from '../../data/forms/address-details.json';
import testFormData from '../../data/forms/_test-form.json';
import yourSituationFormData from '../../data/forms/your-situation.json';
import signInFormData from '../../data/forms/sign-in.json';
import signInVerifyFormData from '../../data/forms/sign-in-verify.json';
import signUpDetailsFormData from '../../data/forms/sign-up-details.json';
import { EligibilityCriteria, MultiStepForm } from '../types/form';
import residentialStatusFormData from '../../data/forms/residential-status.json';
import houseHoldOverview from '../../data/forms/household-details.json';
import peopleInApplication_1 from '../../data/forms/household/people-in-application-1.json';
import peopleInApplication_2 from '../../data/forms/household/people-in-application-2.json';
import peopleInApplication_3 from '../../data/forms/household/people-in-application-3.json';
import peopleInApplication_4 from '../../data/forms/household/people-in-application-4.json';
import peopleInApplication_5 from '../../data/forms/household/people-in-application-5.json';
import peopleInApplication_6 from '../../data/forms/household/people-in-application-6.json';
import peopleInApplication_7 from '../../data/forms/household/people-in-application-7.json';
import addressHistory from '../../data/forms/address-history.json';
import incomeSavings from '../../data/forms/income.json';
import medicalNeeds from '../../data/forms/medical-needs.json';

import CourtOrder from '../../data/forms/Situation/court-order.json';
import AccommodationType from '../../data/forms/Situation/accommodation-type.json';
import DomesticViolence from '../../data/forms/Situation/domestic-violence.json';
import Homelessness from '../../data/forms/Situation/homelessness.json';
import Subletting from '../../data/forms/Situation/subletting.json';
import MedicalNeed from '../../data/forms/Situation/medical-need.json';
import PurchasingProperty from '../../data/forms/Situation/purchasing-property.json';
import PropertyOwnership from '../../data/forms/Situation/property-ownership.json';
import SoldProperty from '../../data/forms/Situation/sold-property.json';
import RelationshipBreakdown from '../../data/forms/Situation/relationship-breakdown.json';
import Arrears from '../../data/forms/Situation/arrears.json';
import UnderOccupying from '../../data/forms/Situation/under-occupying.json';
import Benefits from '../../data/forms/Situation/benefits.json';
import Landlord from '../../data/forms/Situation/landlord.json';
import OtherHousingRegister from '../../data/forms/Situation/other-housing-register.json';
import BreachOfTenancy from '../../data/forms/Situation/breach-of-tenancy.json';
import legalRestrictions from '../../data/forms/Situation/legal-restrictions.json';
import unspentConvictions from '../../data/forms/Situation/unspent-convictions.json';

export const AGREEMENT = 'agreement';
export const SIGN_IN = 'sign-in';
export const SIGN_IN_VERIFY = 'sign-in-verify';
export const SIGN_UP_DETAILS = 'sign-up-details';
export const IMMIGRATION_STATUS = 'immigration-status';
export const PERSONAL_DETAILS = 'personal-details';
export const ADDRESS_DETAILS = 'address-details';
export const YOUR_SITUATION = 'your-situation';
export const RESIDENTIAL_STATUS = 'residential-status';
export const HOUSEHOLD_OVERVIEW = 'household-overview';
export const PEOPLE_IN_APPLICATION = 'people-in-application';
export const ADDRESS_HISTORY = 'address-history';
export const INCOME_SAVINGS = 'income-savings';
export const MEDICAL_NEEDS = 'medical-needs';

export const COURT_ORDER = 'court-order';
export const ACCOMODATION_TYPE = 'AccommodationType';
export const DOMESTIC_VIOLENCE = 'domestic-violence';
export const HOMELESSESS = 'homelessness';
export const SUBLETTING = 'subletting';
export const MEDICAL_NEED = 'medical-need';
export const PURCHASING_PROPERTY = 'purchasing-property';
export const PROPERTY_OWNERSHIP = 'property-ownership';
export const SOLD_PROPERTY = 'sold-property';
export const RELATIONSHIP_BREAKDOWN = 'relationship-breakdown';
export const ARREARS = 'arrears';
export const UNDER_OCCUPYING = 'under-occupying';
export const BENEFITS = 'benefits';
export const LANDLORD = 'landlord';
export const OTHER_HOUSING_REGISTER = 'other-housing-register';
export const BREACH_OF_TENANCY = 'breach-of-tenancy';
export const LEAGLE_RESTRICTIONS = 'legal-restrictions';
export const UNSPENT_CONVICTIONS = 'unspent-convictions';

/**
 * Get the eligibility criteria from the requested form
 * @param {string} formId - The requested eligibility criteria
 * @returns {EligibilityCriteria}
 */
export function getEligibilityCriteria(
  formId: string
): EligibilityCriteria[] | undefined {
  const formData = getFormData(formId);
  return formData?.eligibility;
}

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiStepForm}
 */
export function getFormData(form: string): MultiStepForm {
  switch (form.toLowerCase()) {
    case AGREEMENT:
      return agreementFormData;

    case SIGN_IN:
      return signInFormData;

    case SIGN_IN_VERIFY:
      return signInVerifyFormData;

    case SIGN_UP_DETAILS:
      return signUpDetailsFormData;

    case IMMIGRATION_STATUS:
      return immigrationStatusFormData;

    case PERSONAL_DETAILS:
      return personalDetailsFormData;

    case ADDRESS_DETAILS:
      return addressDetailsFormData;

    case YOUR_SITUATION:
      return yourSituationFormData;

    case RESIDENTIAL_STATUS:
      return residentialStatusFormData;

    case HOUSEHOLD_OVERVIEW:
      return houseHoldOverview;

    case ADDRESS_HISTORY:
      return addressHistory;

    case INCOME_SAVINGS:
      return incomeSavings;

    case MEDICAL_NEEDS:
      return medicalNeeds;

    case COURT_ORDER:
      return CourtOrder;

    case ACCOMODATION_TYPE:
      return AccommodationType;

    case DOMESTIC_VIOLENCE:
      return DomesticViolence;

    case HOMELESSESS:
      return Homelessness;

    case SUBLETTING:
      return Subletting;

    case MEDICAL_NEED:
      return MedicalNeed;

    case PURCHASING_PROPERTY:
      return PurchasingProperty;

    case PROPERTY_OWNERSHIP:
      return PropertyOwnership;

    case SOLD_PROPERTY:
      return SoldProperty;

    case RELATIONSHIP_BREAKDOWN:
      return RelationshipBreakdown;

    case ARREARS:
      return Arrears;

    case UNDER_OCCUPYING:
      return UnderOccupying;

    case BENEFITS:
      return Benefits;

    case LANDLORD:
      return Landlord;

    case OTHER_HOUSING_REGISTER:
      return OtherHousingRegister;

    case BREACH_OF_TENANCY:
      return BreachOfTenancy;

    case LEAGLE_RESTRICTIONS:
      return legalRestrictions;

    case UNSPENT_CONVICTIONS:
      return unspentConvictions;

    default:
      return testFormData;
  }
}

export function getHouseHoldData(form: any): any {
  switch (parseInt(form)) {
    case 1:
      return peopleInApplication_1;
    case 2:
      return peopleInApplication_2;
    case 3:
      return peopleInApplication_3;
    case 4:
      return peopleInApplication_4;
    case 5:
      return peopleInApplication_5;
    case 6:
      return peopleInApplication_6;
    case 7:
      return peopleInApplication_7;
  }
}
