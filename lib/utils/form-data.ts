import addressDetailsFormData from '../../data/forms/address-details.json';
import addressHistory from '../../data/forms/address-history.json';
import agreementFormData from '../../data/forms/agreement.json';
import houseHoldOverview from '../../data/forms/household-details.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import incomeSavings from '../../data/forms/income.json';
import medicalNeeds from '../../data/forms/medical-needs.json';
import peopleInApplication from '../../data/forms/people-in-application.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
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
import { EligibilityCriteria, FormField, MultiStepForm } from '../types/form';

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
      throw new Error('Unknown form step: ' + form);
  }
}

export function getPeopleInApplicationForm(
  additionalResidents: number
): MultiStepForm {
  const formFields = peopleInApplication.steps[0].fields;

  const headerField = (n: number): FormField => ({
    as: 'paragraph',
    label: `Person ${n + 1}`,
    name: `person${n + 1}`,
  });

  const mainApplicantFields = [
    headerField(0),
    ...formFields.map((field) => ({
      ...field,
      name: `mainApplicant.${field.name}`,
    })),
  ];

  const additionalResidentsFields = new Array(additionalResidents)
    .fill(undefined)
    .flatMap((_, i) => [
      headerField(i + 1),
      ...formFields.map((field) => ({
        ...field,
        name: `otherMembers[${i}].${field.name}`,
      })),
    ]);

  return {
    ...peopleInApplication,
    steps: [
      {
        fields: [...mainApplicantFields, ...additionalResidentsFields],
      },
    ],
  };
}
