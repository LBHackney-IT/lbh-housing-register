import { Applicant } from '../../domain/HousingApi';
import { CheckBoxListPageProps } from '../../components/applications/checkBoxList';
import { questionLookup } from '../../lib/utils/applicationQuestions';
import { QuestionKey } from './question-data';

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
  const citizenship = questionLookup(QuestionKey.CITIZENSHIP) || '';
  const studyStatus = questionLookup(QuestionKey.UK_STUDYING) || '';
  const studyStatusText =
    studyStatus === 'yes' ? 'In the UK to study' : 'Not in the uk to study';

  const visaStatus = questionLookup(QuestionKey.IMMIGRATION_VISA);
  const eeaNational = questionLookup(QuestionKey.IMMIGRATION_EA_NATIONAL);
  const sponsership = questionLookup(QuestionKey.IMMIGRATION_SPONSERSHIP);
  const legalStatus = questionLookup(QuestionKey.IMMIGRATION_STATUS) || '';
  const settledStatus = questionLookup(QuestionKey.IMMIGRATION_SETTLED_STATUS);

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
  const personalDetails: CheckBoxListPageProps = {
    title: 'Address History',
    data: [
      {
        title: 'Current Address',
        value: `Address Line one, Hackney, London, E8 1AB, From Jan 2021 (6 months)`,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const currentAccomodationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const personalDetails: CheckBoxListPageProps = {
    title: 'Current Accommodation',
    data: [
      {
        title: 'Accommodation',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Shared with',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Bedrooms',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Living rooms',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Dining Rooms',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Bathrooms',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Kitchens',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Other rooms',
        value: ``,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const situationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const personalDetails: CheckBoxListPageProps = {
    title: 'Situation',
    data: [
      {
        title: 'Found intentionally homeless',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Property owner',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Sold property in 5 years',
        value: ``,
        isChecked: false,
      },
      {
        title: 'In 4+ weeks rent arrears',
        value: ``,
        isChecked: false,
      },
      {
        title: 'On another housing register',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Sold property in 5 years',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Previous warning for breach of tenancy',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Legal housing restrictions',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Unspent convictions',
        value: ``,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const employmentCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const personalDetails: CheckBoxListPageProps = {
    title: 'Employment',
    data: [
      {
        title: 'Status',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Accommodation Address',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Course Completion date',
        value: ``,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};

export const incomeAndSavingsCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const personalDetails: CheckBoxListPageProps = {
    title: 'Household income and savings',
    data: [
      {
        title: 'Yearly household income',
        value: ``,
        isChecked: false,
      },
      {
        title: 'Household savings',
        value: ``,
        isChecked: false,
      },
    ],
  };

  return personalDetails;
};
