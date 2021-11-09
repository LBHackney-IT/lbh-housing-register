import { Applicant } from '../../domain/HousingApi';
import { CheckBoxListPageProps } from '../../components/admin/checkbox-list';
import {
  questionLookup,
  getQuestionValue,
} from '../../lib/utils/applicationQuestions';
import { QuestionKey } from './question-data';
import {
  AddressHistoryEntry,
  calculateDurations,
} from '../../lib/utils/addressHistory';
import { formatDate } from '../../lib/utils/dateOfBirth';
import { getGenderName } from './gender';

const legalStatusText = (option: string): string => {
  switch (option) {
    case 'Indefinite-leave-to-remain':
      return 'Indefinite Leave to Remain';

    case 'Discretionary-leave-to-remain':
      return 'Discretionary Leave to Remain';

    case 'Exceptional-leave-to-remain':
      return 'Exceptional Leave to Remain';

    case 'Refugee-status':
      return 'Granted refugee status';

    case 'Humanitarian-protection':
      return 'Granted humanitarian protection';

    case 'Limited-leave-to-remain-no-public-funds':
      return 'Limited Leave to Remain with no recourse to public funds';

    case 'Other':
      return 'Other';

    default:
      return 'N/A';
  }
};

const employmentStatus = (option: string): string => {
  switch (option) {
    case 'Employed':
      return 'Employed';

    case 'Selfemployed':
      return 'Self Employed';

    case 'Fulltimestudent':
      return 'Full time student';

    case 'Unemployed':
      return 'Unemployed';

    case 'Retired':
      return 'Retired';

    default:
      return 'N/A';
  }
};

const incomeDetails = (option: string): string => {
  switch (option) {
    case 'Under20000':
      return 'Under £20,000';

    case '20to40000':
      return ' £20,000 to £39,999';

    case '40to60000':
      return '£40,000 to £59,999';

    case '60to80000':
      return '£60,000 to £79,999';

    case '80to100000':
      return '£80,000 to £99,999';

    case '100000':
      return '£100,000 or more';

    default:
      return 'N/A';
  }
};

const savingDetails = (option: string): string => {
  switch (option) {
    case 'Under5000':
      return 'Under £5,000';

    case '5to10000':
      return '£5,000 to £9,999';

    case '10to30000':
      return '£10,000 to £29,999';

    case '30to50000':
      return '£30,000 to £49,999';

    case '50to80000':
      return '£50,000 to £79,999';

    case '80000':
      return '£80,000 or more';

    default:
      return 'N/A';
  }
};

export const personalDetailsCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const nationalInsurance = applicant?.person?.nationalInsuranceNumber || '';
  const phonNumber = applicant?.contactInformation?.phoneNumber || '';
  const email = applicant?.contactInformation?.emailAddress || '';

  const personalDetailsSection: CheckBoxListPageProps = {
    title: 'Personal Details',
    data: [
      {
        title: 'Name',
        value: `${applicant?.person?.title} ${applicant?.person?.firstName} ${applicant?.person?.surname}`,
        isChecked: false,
      },
      {
        title: 'Date of birth',
        value: `${formatDate(applicant?.person?.dateOfBirth)}`,
        isChecked: false,
      },
      {
        title: 'Gender',
        value: `${getGenderName(applicant!)}`,
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

  return personalDetailsSection;
};

export const immigrationStatusCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const citizenship = getQuestionValue(QuestionKey.CITIZENSHIP, applicant);
  const citizenshipText =
    citizenship === 'European'
      ? 'EEA citizen'
      : citizenship === 'Other'
      ? 'Non-EEA citizen'
      : citizenship;

  // EEA citizen
  const studyStatus = getQuestionValue(QuestionKey.UK_STUDYING, applicant);
  const settledStatus = getQuestionValue(
    QuestionKey.IMMIGRATION_SETTLED_STATUS,
    applicant
  );

  // Non-EEA citizen
  const visaStatus = getQuestionValue(QuestionKey.IMMIGRATION_VISA, applicant);
  const eeaNational = getQuestionValue(
    QuestionKey.IMMIGRATION_EA_NATIONAL,
    applicant
  );
  const sponsership = getQuestionValue(
    QuestionKey.IMMIGRATION_SPONSERSHIP,
    applicant
  );
  const legalStatus = getQuestionValue(
    QuestionKey.IMMIGRATION_STATUS,
    applicant
  );

  const immigrationStatusSection: CheckBoxListPageProps =
    citizenship === 'British'
      ? {
          title: 'Immigration status',
          data: [
            {
              title: 'Citizenship',
              value: `${citizenshipText}`,
              isChecked: false,
            },
          ],
        }
      : citizenship === 'European'
      ? {
          title: 'Immigration status',
          data: [
            {
              title: 'Citizenship',
              value: `${citizenshipText}`,
              isChecked: false,
            },
            {
              title: 'In the UK to study',
              value: `${studyStatus}`,
              isChecked: false,
            },
            {
              title: 'Settled or pre-settled status',
              value: `${settledStatus}`,
              isChecked: false,
            },
          ],
        }
      : {
          title: 'Immigration status',
          data: [
            {
              title: 'Citizenship',
              value: `${citizenshipText}`,
              isChecked: false,
            },
            {
              title: 'In the UK on work or study visa',
              value: `${visaStatus}`,
              isChecked: false,
            },
            {
              title: 'Family member of EEA national',
              value: `${eeaNational}`,
              isChecked: false,
            },
            {
              title: 'Receiving sponsorship to stay in UK',
              value: `${sponsership}`,
              isChecked: false,
            },
            {
              title: 'Legal status',
              value: `${legalStatusText(legalStatus)}`,
              isChecked: false,
            },
          ],
        };

  return immigrationStatusSection;
};

export const residentialStatusCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const institutions = questionLookup(
    QuestionKey.RESIDENTIAL_STATUS_INSTITUTIONS
  );

  let institutionsText = '';
  if (institutions) {
    var institutionsArray = JSON.parse(institutions);
    institutionsArray.map((item: string) => {
      institutionsText += item;
    });
  } else {
    institutionsText = 'N/A';
  }

  const residentialStatus = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_RESIDENTIAL_STATUS,
    applicant
  );
  const movedBorough = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_MOVED_BOROUGH,
    applicant
  );
  const homeless = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_HOMELESS,
    applicant
  );
  const asboBehaviour = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_ASBO_BEHAVIOUR,
    applicant
  );
  const armedForces = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_ARMED_FORCES,
    applicant
  );
  const mobilityScheme = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_MOBILITY_SCHEME,
    applicant
  );
  const homelessnessAccepted = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_HOMELESSNESS_ACCEPTED,
    applicant
  );
  const socialHousing = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_SOCIAL_HOUSING,
    applicant
  );
  const workInHackney = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_WORK_IN_HACKNEY,
    applicant
  );
  const providingCare = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_PROVIDING_CARE,
    applicant
  );
  const domesticViolence = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_DOMESTIC_VIOLENCE,
    applicant
  );
  const studyingOutsideHackney = getQuestionValue(
    QuestionKey.RESIDENTIAL_STATUS_STUDYING_OUTSIDE_BOROUGH,
    applicant
  );

  const residentialStatusSection: CheckBoxListPageProps = {
    title: 'Residential status',
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
        title: 'Work in Hackney or offered a permanent job in Hackney',
        value: `${workInHackney}`,
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

  return residentialStatusSection;
};

export const addressHistoryCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const addressHistory = questionLookup(QuestionKey.ADDRESS_HISTORY, applicant);

  const addressHistorySection: CheckBoxListPageProps = {
    title: 'Address History',
    data: [],
  };

  if (addressHistory) {
    //Address Line one, Hackney, London, E8 1AB, From Jan 2021 (6 months)
    var addressHistorysArray = JSON.parse(addressHistory);

    const durations = calculateDurations(addressHistorysArray);
    const history = addressHistorysArray.map(
      (historyEntry: AddressHistoryEntry, index: number) => {
        let addressHistoryText = '';
        if (historyEntry.address.line1) {
          addressHistoryText += `${historyEntry.address.line1}, `;
        }
        if (historyEntry.address.line2) {
          addressHistoryText += `${historyEntry.address.line2}, `;
        }
        if (historyEntry.address.town) {
          addressHistoryText += `${historyEntry.address.town}, `;
        }
        if (historyEntry.address.county) {
          addressHistoryText += `${historyEntry.address.county}, `;
        }
        if (historyEntry.postcode) {
          addressHistoryText += `${historyEntry.postcode} `;
        }

        return {
          title: index === 0 ? 'Current address' : 'Previous address',
          value: `${addressHistoryText} - ${durations[index].label}`,
          isChecked: false,
        };
      }
    );

    addressHistorySection.data = history;
  }

  return addressHistorySection;
};

export const currentAccomodationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const accommodation = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_LIVING_SITUATION,
    applicant
  );
  const home = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME,
    applicant
  );
  const floor = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_FLOOR,
    applicant
  );
  const sharedWith = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_PEOPLE_SHARE,
    applicant
  );
  const numberOfBedrooms = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_BEDROOMS,
    applicant
  );
  const livingrooms = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_LIVINGROOMS,
    applicant
  );
  const diningRoom = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_DININGROOMS,
    applicant
  );
  const bathrooms = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_BATHROOMS,
    applicant
  );
  const kitchens = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_KITCHENS,
    applicant
  );
  const otherRooms = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOME_HOW_MANY_OTHER_ROOMS,
    applicant
  );
  const hostName = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOST_PERSON_NAME,
    applicant
  );
  const hostNumber = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_HOST_PERSON_NUMBER,
    applicant
  );
  const landlordName = getQuestionValue(
    QuestionKey.CURRENT_ACCOMMODATION_LANDLORD_PERSON_NAME,
    applicant
  );

  const currentAccomodationSection: CheckBoxListPageProps = {
    title: 'Current accommodation',
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
        title: 'Dining rooms',
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
        title: 'Host name',
        value: `${hostName}`,
        isChecked: false,
      },
      {
        title: 'Host number',
        value: `${hostNumber}`,
        isChecked: false,
      },
      {
        title: 'Landlord name',
        value: `${landlordName}`,
        isChecked: false,
      },
    ],
  };

  return currentAccomodationSection;
};

export const situationCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const armedForces = getQuestionValue(
    QuestionKey.YOUR_SITUATION_ARMED_FORCES,
    applicant
  );
  const courtOrder = getQuestionValue(
    QuestionKey.YOUR_SITUATION_COURT_ORDER,
    applicant
  );
  const socialTenant = getQuestionValue(
    QuestionKey.YOUR_SITUATION_SOCIAL_TENANT,
    applicant
  );
  const domesticViolence = getQuestionValue(
    QuestionKey.YOUR_SITUATION_DOMESTIC_VIOLENCE,
    applicant
  );
  const subletting = getQuestionValue(
    QuestionKey.YOUR_SITUATION_SUBLETTING,
    applicant
  );
  const homeless = getQuestionValue(
    QuestionKey.YOUR_SITUATION_HOMELESSNESS,
    applicant
  );
  const propertyOwner = getQuestionValue(
    QuestionKey.YOUR_SITUATION_PROPERTY_OWNERSHIP,
    applicant
  );
  const soldProperty = getQuestionValue(
    QuestionKey.YOUR_SITUATION_SOLD_PROPERTY,
    applicant
  );
  const buyProperty = getQuestionValue(
    QuestionKey.YOUR_SITUATION_BUY_PROPERTY,
    applicant
  );
  const arrears = getQuestionValue(
    QuestionKey.YOUR_SITUATION_ARREARS,
    applicant
  );
  const underOccupying = getQuestionValue(
    QuestionKey.YOUR_SITUATION_UNDER_OCCUPYING,
    applicant
  );
  const landlordAgreement = getQuestionValue(
    QuestionKey.YOUR_SITUATION_LANDLORD_AGREEMENT,
    applicant
  );
  const breachOfTenancy = getQuestionValue(
    QuestionKey.YOUR_SITUATION_BREACH_OF_TENANCY,
    applicant
  );
  const legalRestrictions = getQuestionValue(
    QuestionKey.YOUR_SITUATION_LEGAL_RESTRICTIONS,
    applicant
  );
  const unspentConvictions = getQuestionValue(
    QuestionKey.YOUR_SITUATION_UNSPENT_CONVICTIONS,
    applicant
  );
  const onAnotherHousingRegister = getQuestionValue(
    QuestionKey.YOUR_SITUATION_OTHER_HOUSING_REGISTER,
    applicant
  );

  const yourSituationSection: CheckBoxListPageProps = {
    title: 'Situation',
    data: [
      {
        title: 'Served in armed forces',
        value: `${armedForces}`,
        isChecked: false,
      },
      {
        title: 'Court order',
        value: `${courtOrder}`,
        isChecked: false,
      },
      {
        title: 'Social tenant or in TA',
        value: `${socialTenant}`,
        isChecked: false,
      },
      {
        title: 'Fleeing domestic violence',
        value: `${domesticViolence}`,
        isChecked: false,
      },
      {
        title: 'Subletting',
        value: `${subletting}`,
        isChecked: false,
      },
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
        title: 'Able to buy property',
        value: `${buyProperty}`,
        isChecked: false,
      },
      {
        title: 'In 4+ weeks rent arrears',
        value: `${arrears}`,
        isChecked: false,
      },
      {
        title: 'Under occupying',
        value: `${underOccupying}`,
        isChecked: false,
      },
      {
        title: 'Landlord agreement',
        value: `${landlordAgreement}`,
        isChecked: false,
      },
      {
        title: 'On another housing register',
        value: `${onAnotherHousingRegister}`,
        isChecked: false,
      },
      {
        title: 'Previous warning for breach of tenancy',
        value: `${breachOfTenancy}`,
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

  return yourSituationSection;
};

export const employmentCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const employmentStatusValue = getQuestionValue(
    QuestionKey.EMPLOYMENT_EMPLOYMENT_STATUS,
    applicant
  );

  let employmentStatusText = 'N/A';
  if (employmentStatusValue !== 'N/A') {
    employmentStatusText = employmentStatus(employmentStatusValue);
  }

  const addressFinder = getQuestionValue(
    QuestionKey.EMPLOYMENT_ADDRESS_FINDER,
    applicant
  );
  const courseCompletionDate = getQuestionValue(
    QuestionKey.EMPLOYMENT_COURSE_COMPLETION_DATE,
    applicant
  );

  let courseCompletionDateText = 'N/A';
  if (courseCompletionDate != 'N/A') {
    courseCompletionDateText = formatDate(courseCompletionDate);
  }

  const employmentSection: CheckBoxListPageProps =
    employmentStatusText !== 'Fulltimestudent'
      ? {
          title: 'Employment',
          data: [
            {
              title: 'Status',
              value: `${employmentStatusText}`,
              isChecked: false,
            },
          ],
        }
      : {
          title: 'Employment',
          data: [
            {
              title: 'Status',
              value: `${employmentStatusText}`,
              isChecked: false,
            },
            {
              title: 'Accommodation address',
              value: `${addressFinder}`,
              isChecked: false,
            },
            {
              title: 'Course completion date',
              value: `${courseCompletionDateText}`,
              isChecked: false,
            },
          ],
        };

  return employmentSection;
};

export const incomeAndSavingsCheckboxList = (
  applicant?: Applicant
): CheckBoxListPageProps => {
  const income = getQuestionValue(QuestionKey.MONEY_INCOME, applicant);
  const savings = getQuestionValue(QuestionKey.MONEY_SAVINGS, applicant);

  const incomeAndSavingsSection: CheckBoxListPageProps = {
    title: 'Household income and savings',
    data: [
      {
        title: 'Yearly household income',
        value: `${incomeDetails(income)}`,
        isChecked: false,
      },
      {
        title: 'Household savings',
        value: `${savingDetails(savings)}`,
        isChecked: false,
      },
    ],
  };

  return incomeAndSavingsSection;
};
