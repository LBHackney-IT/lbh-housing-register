import { Applicant } from '../../domain/HousingApi';
import { CheckBoxListPageProps } from '../../components/applications/checkBoxList';
import { MedicalDetailPageProps } from '../../components/applications/medical-details';
import { questionLookup } from '../../lib/utils/applicationQuestions';
import { QuestionKey } from './question-data';
import {
  AddressHistoryEntry,
  calculateDurations,
} from '../../lib/utils/addressHistory';

const legalStaus = (option: string): string => {
  switch (option) {
    case 'indefinite-leave-to-remain':
      return 'I have Indefinite Leave to Remain';

    case 'discretionary-leave-to-remain':
      return 'I have Discretionary Leave to Remain';

    case 'exceptional-leave-to-remain':
      return 'I have Exceptional Leave to Remain';

    case 'refugee-status':
      return 'I have been granted refugee status';

    case 'humanitarian-protection':
      return 'I have been granted humanitarian protection';

    case 'limited-leave-to-remain-no-public-funds':
      return 'I have limited Leave to Remain with no recourse to public funds';

    case 'other':
      return 'other';

    default:
      return '';
  }
};

export const personalDetailsCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const nationalInsurance = applicant?.person?.nationalInsuranceNumber || '';
  const phonNumber = applicant?.contactInformation?.phoneNumber || '';
  const email = applicant?.contactInformation?.emailAddress || '';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Personal Details',
    data: [
      {
        title: 'Name',
        value: `${applicant?.person?.title} ${applicant?.person?.firstName} ${applicant?.person?.surname}`,
        isChecked: false,
      },
      {
        title: 'National Insurance',
        value: `${nationalInsurance}`,
        isChecked: false,
      },
      {
        title: 'Phone',
        value: `${phonNumber}`,
        isChecked: false,
      },
      {
        title: 'Email',
        value: `${email}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const immigrationStatusCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const citizenship =
    questionLookup(QuestionKey.CITIZENSHIP, applicant) || 'N/A';
  const studyStatus =
    questionLookup(QuestionKey.UK_STUDYING, applicant) || 'N/A';
  const studyStatusText =
    studyStatus === 'yes' ? 'In the UK to study' : 'Not in the uk to study';

  const visaStatus = questionLookup(QuestionKey.IMMIGRATION_VISA) || 'N/A';
  const eeaNational =
    questionLookup(QuestionKey.IMMIGRATION_EA_NATIONAL) || 'N/A';
  const sponsership =
    questionLookup(QuestionKey.IMMIGRATION_SPONSERSHIP) || 'N/A';
  const legalStatus = questionLookup(QuestionKey.IMMIGRATION_STATUS) || 'N/A';
  const settledStatus =
    questionLookup(QuestionKey.IMMIGRATION_SETTLED_STATUS) || 'N/A';

  let visaStatusText = '';
  visaStatusText +=
    visaStatus === 'yes'
      ? 'I have a work study visa. '
      : 'I do not have a work study visa. ';

  visaStatusText +=
    eeaNational === 'yes'
      ? 'I am an EEA national. '
      : 'I am not an EEA national. ';

  visaStatusText +=
    sponsership === 'yes'
      ? 'I am recieving sponsorship. '
      : 'I am not recieving sponsorship. ';

  if (sponsership === 'no') {
    visaStatusText += legalStaus(legalStatus);
  }

  visaStatusText +=
    settledStatus === 'yes'
      ? 'I have settled status'
      : 'I do not have settled status';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Immigration status',
    data: [
      {
        title: 'Citizenship',
        value: `${citizenship}`,
        isChecked: false,
      },
      {
        title: 'Study Status',
        value: `${studyStatusText}`,
        isChecked: false,
      },
      {
        title: 'Visa Status',
        value: `${visaStatusText}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const livingSituationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const institutions =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_INSTITUTIONS) || '';
  let institutionsText = '';

  if (institutions !== '') {
    var institutionsArray = JSON.parse(institutions);
    institutionsArray.map((item: string) => {
      institutionsText += item;
    });
  } else {
    institutionsText === 'N/A';
  }

  const residentialStatus =
    questionLookup(
      QuestionKey.RESIDENTIAL_STATUS_RESIDENTIAL_STATUS,
      applicant
    ) || 'N/A';

  const armedForces =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_ARMED_FORCES, applicant) ||
    'N/A';

  const mobilityScheme =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_MOBILITY_SCHEME, applicant) ||
    'N/A';

  const domesticViolence =
    questionLookup(
      QuestionKey.RESIDENTIAL_STATUS_DOMESTIC_VIOLENCE,
      applicant
    ) || 'N/A';

  const studyingOutsideHackney =
    questionLookup(
      QuestionKey.RESIDENTIAL_STATUS_STUDYING_OUTSIDE_BOROUGH,
      applicant
    ) || 'N/A';

  const providingCare =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_PROVIDING_CARE, applicant) ||
    'N/A';

  const homelessnessAccepted =
    questionLookup(
      QuestionKey.RESIDENTIAL_STATUS_HOMELESSNESS_ACCEPTED,
      applicant
    ) || 'N/A';

  const asboBehaviour =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_ASBO_BEHAVIOUR, applicant) ||
    'N/A';

  const homeless =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_HOMELESS, applicant) || 'N/A';

  const socialHousing =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_SOCIAL_HOUSING, applicant) ||
    'N/A';

  const movedBorough =
    questionLookup(QuestionKey.RESIDENTIAL_STATUS_MOVED_BOROUGH, applicant) ||
    'N/A';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Living Situation',
    data: [
      {
        title: '3 year residential status',
        value: `${residentialStatus}`,
        isChecked: false,
      },
      {
        title: 'Explain periods away from Hackney',
        value: `${movedBorough}`,
        isChecked: false,
      },
      {
        title:
          'Homeless and living in temporary accommodation outside of Hackney',
        value: `${homeless}`,
        isChecked: false,
      },
      {
        title:
          'Unable to live in the borough due to a court order or injunction',
        value: `${asboBehaviour}`,
        isChecked: false,
      },
      {
        title: 'Applicant or partner has served in the armed forces',
        value: `${armedForces}`,
        isChecked: false,
      },
      {
        title:
          'Applicant or partner is a nominee under the National Witness Mobility Scheme',
        value: `${mobilityScheme}`,
        isChecked: false,
      },
      {
        title: 'Accepted with homeless with main duty',
        value: `${homelessnessAccepted}`,
        isChecked: false,
      },
      {
        title:
          'Existing Hackney social tenant with an assured or fixed term tenancy',
        value: `${socialHousing}`,
        isChecked: false,
      },
      {
        title: 'Moving to Hackney to provide care to a Hackney resident',
        value: `${providingCare}`,
        isChecked: false,
      },
      {
        title:
          'Fleeing domestic violence or moving for social or welfare reasons',
        value: `${domesticViolence}`,
        isChecked: false,
      },
      {
        title: 'Applicant is a student and studying outside Hackney',
        value: `${studyingOutsideHackney}`,
        isChecked: false,
      },
      {
        title:
          'Applicant has been staying any institution for the last 3 years',
        value: `${institutionsText}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const addressHistoryCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const addressHistory =
    questionLookup(QuestionKey.ADDRESS_HISTORY, applicant) || 'N/A';

  let addressHistoryText = '';

  if (addressHistory !== 'N/A') {
    //Address Line one, Hackney, London, E8 1AB, From Jan 2021 (6 months)
    var addressHistorysArray: AddressHistoryEntry = JSON.parse(addressHistory);

    if (addressHistorysArray.address.line1 !== '') {
      addressHistoryText += `${addressHistorysArray.address.line1} `;
    }

    if (addressHistorysArray.address.line2 !== '') {
      addressHistoryText += `${addressHistorysArray.address.line2} `;
    }

    if (addressHistorysArray.address.line3 !== '') {
      addressHistoryText += `${addressHistorysArray.address.line3} `;
    }

    if (addressHistorysArray.address.line4 !== '') {
      addressHistoryText += `${addressHistorysArray.address.line4} `;
    }

    if (addressHistorysArray.address.town !== '') {
      addressHistoryText += `${addressHistorysArray.address.town}, `;
    }

    if (addressHistorysArray.address.county !== '') {
      addressHistoryText += `${addressHistorysArray.address.county}, `;
    }

    if (addressHistorysArray.address.postcode !== '') {
      addressHistoryText += `${addressHistorysArray.address.postcode} `;
    }

    if (
      addressHistorysArray.date !== '' &&
      addressHistorysArray.dateTo !== ''
    ) {
      const durations = calculateDurations([addressHistorysArray]);

      addressHistoryText += `From ${durations[0].from.getMonth()} ${durations[0].from.getFullYear()}`;

      if (durations.length !== 0) {
        if (durations[0].years === 0 && durations[0].months <= 11) {
          addressHistoryText += `(${durations[0].months} months)`;
        }

        if (durations[0].years >= 1) {
          addressHistoryText += `(${durations[0].years} years and ${durations[0].months} months)`;
        }
      }
    }
  }

  const personalDetails: CheckBoxListPageProps = {
    title: 'Address History',
    data: [
      {
        title: 'Current Address',
        value: `${addressHistoryText}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const currentAccomodationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const accommodation =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_LIVING_SITUATION,
      applicant
    ) || 'N/A';

  const home =
    questionLookup(QuestionKey.CURRENT_ACCOMMODATION_HOME, applicant) || 'N/A';

  const floor =
    questionLookup(QuestionKey.CURRENT_ACCOMMODATION_HOME_FLOOR, applicant) ||
    'N/A';

  const sharedWith =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_PEOPLE_SHARE,
      applicant
    ) || 'N/A';
  const numberOfBedrooms =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_BEDROOMS,
      applicant
    ) || 'N/A';
  const livingrooms =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_LIVINGROOMS,
      applicant
    ) || 'N/A';
  const diningRoom =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_DININGROOMS,
      applicant
    ) || 'N/A';

  const bathrooms =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_BATHROOMS,
      applicant
    ) || 'N/A';

  const kitchens =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_KITCHENS,
      applicant
    ) || 'N/A';

  const otherRooms =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_OTHER_ROOMS,
      applicant
    ) || 'N/A';

  const hostName =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOST_PERSON_NAME,
      applicant
    ) || 'N/A';

  const hostNumber =
    questionLookup(
      QuestionKey.CURRENT_ACCOMMODATION_HOST_PERSON_NUMBER,
      applicant
    ) || 'N/A';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Current Accommodation',
    data: [
      {
        title: 'Accommodation',
        value: `${accommodation}`,
        isChecked: false,
      },
      {
        title: 'Home',
        value: `${home}`,
        isChecked: false,
      },
      {
        title: 'Floor',
        value: `${floor}`,
        isChecked: false,
      },
      {
        title: 'Shared with',
        value: `${sharedWith}`,
        isChecked: false,
      },
      {
        title: 'Bedrooms',
        value: `${numberOfBedrooms}`,
        isChecked: false,
      },
      {
        title: 'Living rooms',
        value: `${livingrooms}`,
        isChecked: false,
      },
      {
        title: 'Dining Rooms',
        value: `${diningRoom}`,
        isChecked: false,
      },
      {
        title: 'Bathrooms',
        value: `${bathrooms}`,
        isChecked: false,
      },
      {
        title: 'Kitchens',
        value: `${kitchens}`,
        isChecked: false,
      },
      {
        title: 'Other rooms',
        value: `${otherRooms}`,
        isChecked: false,
      },

      {
        title: 'Host Name',
        value: `${hostName}`,
        isChecked: false,
      },

      {
        title: 'Host Number',
        value: `${hostNumber}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const situationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const homeless =
    questionLookup(QuestionKey.YOUR_SITUATION_HOMELESSNESS, applicant) || 'N/A';

  const propertyOwner =
    questionLookup(QuestionKey.YOUR_SITUATION_PROPERTY_OWNERSHIP, applicant) ||
    'N/A';

  const soldProperty =
    questionLookup(QuestionKey.YOUR_SITUATION_SOLD_PROPERTY, applicant) ||
    'N/A';

  const arrears =
    questionLookup(QuestionKey.YOUR_SITUATION_ARREARS, applicant) || 'N/A';

  const breachOfTennancy =
    questionLookup(QuestionKey.YOUR_SITUATION_BREACH_OF_TENANCY, applicant) ||
    'N/A';

  const legalRestrictions =
    questionLookup(QuestionKey.YOUR_SITUATION_LEGAL_RESTRICTIONS, applicant) ||
    'N/A';

  const unspentConvictions =
    questionLookup(QuestionKey.YOUR_SITUATION_UNSPENT_CONVICTIONS, applicant) ||
    'N/A';

  const onAnotherHousingRegister =
    questionLookup(
      QuestionKey.YOUR_SITUATION_OTHER_HOUSING_REGISTER,
      applicant
    ) || 'N/A';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Situation',
    data: [
      {
        title: 'Found intentionally homeless',
        value: `${homeless}`,
        isChecked: false,
      },
      {
        title: 'Property owner',
        value: `${propertyOwner}`,
        isChecked: false,
      },
      {
        title: 'Sold property in 5 years',
        value: `${soldProperty}`,
        isChecked: false,
      },
      {
        title: 'In 4+ weeks rent arrears',
        value: `${arrears}`,
        isChecked: false,
      },
      {
        title: 'On another housing register',
        value: `${onAnotherHousingRegister}`,
        isChecked: false,
      },
      {
        title: 'Previous warning for breach of tenancy',
        value: `${breachOfTennancy}`,
        isChecked: false,
      },
      {
        title: 'Legal housing restrictions',
        value: `${legalRestrictions}`,
        isChecked: false,
      },
      {
        title: 'Unspent convictions',
        value: `${unspentConvictions}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const employmentCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const employmentStatus =
    questionLookup(QuestionKey.EMPLOYMENT_EMPLOYMENT_STATUS, applicant) ||
    'N/A';

  const addressFinder =
    questionLookup(QuestionKey.EMPLOYMENT_ADDRESS_FINDER, applicant) || 'N/A';

  const courseCompletionDate =
    questionLookup(QuestionKey.EMPLOYMENT_COURSE_COMPLETION_DATE, applicant) ||
    'N/A';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Employment',
    data: [
      {
        title: 'Status',
        value: `${employmentStatus}`,
        isChecked: false,
      },
      {
        title: 'Accommodation Address',
        value: `${addressFinder}`,
        isChecked: false,
      },
      {
        title: 'Course Completion date',
        value: `${courseCompletionDate}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const incomeAndSavingsCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const income = questionLookup(QuestionKey.MONEY_INCOME, applicant) || 'N/A';
  const savings = questionLookup(QuestionKey.MONEY_SAVINGS, applicant) || 'N/A';

  const personalDetails: CheckBoxListPageProps = {
    title: 'Household income and savings',
    data: [
      {
        title: 'Yearly household income',
        value: `${income}`,
        isChecked: false,
      },
      {
        title: 'Household savings',
        value: `${savings}`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const medicalDetailsPageData = (
  applicant?: Applicant
): MedicalDetailPageProps => {
  var details: MedicalDetailPageProps = {
    assessmentRequested: '',
    linkToMedicalForm: '',
    dateFormRecieved: undefined,
    assessmentDate: undefined,
    outcome: '',
    accessibleHousingRegister: '',
    disability: '',
    additionalInformation: '',
  };

  return details;
};
