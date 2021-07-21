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

export enum FormID {
  AGREEMENT = 'agreement',
  SIGN_IN = 'sign-in',
  SIGN_IN_VERIFY = 'sign-in-verify',
  SIGN_UP_DETAILS = 'sign-up-details',
  IMMIGRATION_STATUS = 'immigration-status',
  PERSONAL_DETAILS = 'personal-details',
  ADDRESS_DETAILS = 'address-details',
  YOUR_SITUATION = 'your-situation',
  RESIDENTIAL_STATUS = 'residential-status',
  HOUSEHOLD_OVERVIEW = 'household-overview',
  PEOPLE_IN_APPLICATION = 'people-in-application',
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

function assertNever(never: never, error: string): never {
  throw new Error(error);
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

    case FormID.IMMIGRATION_STATUS:
      return immigrationStatusFormData;

    case FormID.PERSONAL_DETAILS:
      return personalDetailsFormData;

    case FormID.ADDRESS_DETAILS:
      return addressDetailsFormData;

    case FormID.YOUR_SITUATION:
      return yourSituationFormData;

    case FormID.RESIDENTIAL_STATUS:
      return residentialStatusFormData;

    case FormID.HOUSEHOLD_OVERVIEW:
      return houseHoldOverview;

    case FormID.ADDRESS_HISTORY:
      return addressHistory;

    case FormID.INCOME_SAVINGS:
      return incomeSavings;

    case FormID.MEDICAL_NEEDS:
      return medicalNeeds;

    case FormID.COURT_ORDER:
      return CourtOrder;

    case FormID.ACCOMODATION_TYPE:
      return AccommodationType;

    case FormID.DOMESTIC_VIOLENCE:
      return DomesticViolence;

    case FormID.HOMELESSESS:
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

    case FormID.LEAGLE_RESTRICTIONS:
      return legalRestrictions;

    case FormID.UNSPENT_CONVICTIONS:
      return unspentConvictions;

    case FormID.PEOPLE_IN_APPLICATION:
      return peopleInApplication;

    default:
      return assertNever(form, 'Unknown form step: ' + form);
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
