import Layout from '../../../components/layout/resident-layout';
import {
  getQuestionValue,
  selectApplicant,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import { ButtonLink } from '../../../components/button';
import Custom404 from '../../404';
import DeleteLink from '../../../components/delete-link';
import { FormID } from '../../../lib/utils/form-data';

// Date types have been ignored for the most parts and need serious attention!!!

interface DisplayProps {
  question: {
    id?: string | undefined;
    answer?: string | undefined;
  };
}

const retrieveSectionName = (question: any) => {
  return question['id'].substr(question['id'].lastIndexOf('/') + 1);
};

const normalizeString = (answer: string) => {
  return answer.replace(/[^a-zA-Z0-9 ]/g, '');
};

export function ImmigrationStatus(data) {
  const formulator = (question: any) => {
    if (question) {
      if (retrieveSectionName(question) === 'citizenship') {
        if (normalizeString(question['answer']) === 'european') {
          return 'an EEA';
        }

        if (normalizeString(question['answer']) === 'british') {
          return 'a British';
        }
      }

      if (retrieveSectionName(question) === 'uk-studying') {
        if (normalizeString(question['answer']) === 'yes') {
          return 'currently studying in the UK';
        }

        if (normalizeString(question['answer']) === 'no') {
          return '';
        }
      }

      if (retrieveSectionName(question) === 'settled-status') {
        if (normalizeString(question['answer']) === 'yes') {
          return 'and I have a pre-settled status';
        }

        if (normalizeString(question['answer']) === 'no') {
          return '';
        }
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Immigration status</h4>
      <p className="lbh-body-m">
        I am <strong>{formulator(data[0])}</strong> citizen{' '}
        <strong>{data[1] ? formulator(data[1]) : ''}</strong>{' '}
        <strong>{data[2] ? formulator(data[2]) : ''}</strong>
      </p>
    </div>
  );
}

export function ResidentialStatus(data) {
  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Residential Status</h4>
      <p className="lbh-body-m"></p>
    </div>
  );
}

export function CurrentAccommodation(data) {
  const formulator = (question: any) => {
    if (retrieveSectionName(question) === 'living-situation') {
      switch (normalizeString(question['answer'])) {
        case 'livingwithparents':
          return 'with parents';
        case 'livingwithfriends':
          return 'with friends';
        case 'livingwithrelatives':
          return 'with relatives';
        case 'temporaryaccommodation':
          return 'temporary accommodation';
        case 'privaterental':
          return 'private rental';
        case 'owneroccupier':
          return 'owner occupier';
        case 'nofixedabode':
          return 'no fixed abode';
        case 'squatter':
          return 'squatter';
        case 'unauthorisedoccupant':
          return 'unauthorised occupant';
        case 'tiedaccommodation':
          return 'tied accommodation';
      }
    }

    if (retrieveSectionName(question) === 'home') {
      switch (normalizeString(question['answer'])) {
        case 'house':
          return 'house';
        case 'flat':
          return 'flat';
        case 'flataboveshop':
          return 'flat above shop';
        case 'maisonnette':
          return 'maisonnette';
        case 'bungalow':
          return 'bungalow';
        case 'hotelhostel':
          return 'hotel hostel';
        case 'boat':
          return 'boat';
        case 'caravan':
          return 'caravan';
        case 'studio':
          return 'studio';
        case 'other':
          return 'other';
      }
    }

    if (retrieveSectionName(question) === 'home-floor') {
      return question['answer'];
    }

    if (retrieveSectionName(question) === 'home-how-many-people-share') {
      return question['answer'];
    }
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <h4 className="lbh-heading-h4">Current Accommodation</h4>
        <p className="lbh-body-m">
          I am living <strong>{formulator(data[0])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I live in a <strong>{formulator(data[1])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home is on floor <strong>{formulator(data[2])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I share my home with <strong>{formulator(data[3])}</strong> people not
          included in this application
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[4]['answer']}</strong> bedroom(s)
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[5]['answer']}</strong> bathrooms
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[6]['answer']}</strong> kitchen
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[7]['answer']}</strong> other rooms
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I have <strong>{data[8]['answer']}</strong> rooms for my own personal
          use
        </p>
      </div>
    </>
  );
}

export function MySituation(data) {
  return (
    <>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <h4 className="lbh-heading-h4">My Situation</h4>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[0]['answer']) === 'yes'
              ? 'I have been'
              : 'I have not'}
          </strong>{' '}
          been found intentionally homelessness by any local housing
          authority(in accordance with the housing act 1996 section 184) within
          the last 2 years
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[1]['answer']) === 'yes' ? 'I do' : 'I do not'}
          </strong>{' '}
          own any property
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[2]['answer']) === 'yes'
              ? 'I have'
              : 'I have not'}
          </strong>{' '}
          sold any property within the last 5 years
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[3]['answer']) === 'yes' ? 'I am' : 'I am not'}
          </strong>{' '}
          in four or more weeks arrears with rent, council tax or service
          charges
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[4]['answer']) === 'yes'
              ? 'I am, and my partner is'
              : 'I am not, and my partner is not'}
          </strong>{' '}
          on another local authority's housing register
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[5]['answer']) == 'yes'
              ? 'Someone in my household has'
              : 'Nobody in my household has'}
          </strong>{' '}
          previously received a warning for a breach of tenancy
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[7]['answer']) === 'yes'
              ? 'Somebody in my household'
              : 'Nobody in my household'}
          </strong>{' '}
          has any legal restrictions in where they can live in the borough
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[8]['answer']) === 'yes'
              ? 'Somebody in my household'
              : 'Nobody in my household'}
          </strong>{' '}
          has any unspent convictions
        </p>
      </div>
    </>
  );
}

export function IncomeSavings(data) {
  interface Money {
    [key: string]: string;
  }

  const incomeValues: Money = {
    under20000: 'Under £20,000',
    '20to40000': '£20,000 - £39,999',
    '40to60000': '£40,000 - £59,999',
    '60to80000': '£60,000 - £79,999',
    '80to100000': '£80,000 - £99,999',
    '100000': '£100,000 or more',
  };

  const savingsValues: Money = {
    under5000: 'Under £5,000',
    '5to10000': '£5,000 - £9,999',
    '10to30000': '£10,000 - £29,999',
    '30to50000': '£30,000 - £49,999',
    '50to80000': '£50,000 - £79,999',
    '80000': '£80,000 or more',
  };

  const formulator = (question: any) => {
    if (retrieveSectionName(question) === 'savings') {
      return savingsValues[normalizeString(question['answer'])];
    }

    if (retrieveSectionName(question) === 'income') {
      return incomeValues[normalizeString(question['answer'])];
    }
  };
  return (
    <>
      <div
        style={{
          borderBottom: '1px solid',
          color: '#b1b4b6',
        }}
      >
        <h4 className="lbh-heading-h4">Income & savings</h4>
        <p className="lbh-body-m">
          My total yearly household income is{' '}
          <strong>{formulator(data[0])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          In total, my household has combined savings and capital of{' '}
          <strong>{formulator(data[1])}</strong>
        </p>
      </div>
    </>
  );
}

export function Employment(data) {
  const formulator = (question: any) => {
    if (retrieveSectionName(question) === 'employment') {
      switch (normalizeString(question['answer'])) {
        case 'employed':
          return 'full time employed';
        case 'self-employed':
          return 'self employed';
        case 'fulltimestudent':
          return 'a full time student';
        case 'unemployed':
          return 'unemployed';
        case 'retired':
          return 'retired';
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Employment</h4>
      <p className="lbh-body-m">
        I am <strong>{formulator(data[0])}</strong>
      </p>
    </div>
  );
}

export function AddressHistory(data) {
  // Address is weirdly constructed
  const getSpecificDates = (date: Date) => {
    const dateObj = new Date(date);
    return {
      month: dateObj.toLocaleString('default', { month: 'long' }),
      year: dateObj.toLocaleString('default', { year: 'numeric' }),
    };
  };

  return (
    <>
      <h4 className="lbh-heading-h4">Address history</h4>
      {JSON.parse(data[0]['answer']).map((address, index) => {
        return (
          <>
            <div
              key={index}
              style={{
                borderBottom: '1px solid',
                color: '#b1b4b6',
              }}
            >
              <p className="lbh-body-m">
                {index === 0 ? 'Current Address' : 'Previous Address'}
              </p>
              <p className="lbh-body-m">
                <strong>
                  {address['address']['line1']}, {address['address']['town']},{' '}
                  {address['postcode']}
                </strong>
              </p>
              <p className="lbh-body-m">
                From{' '}
                <strong>
                  {getSpecificDates(address['date'])['month']}{' '}
                  {getSpecificDates(address['date'])['year']}{' '}
                  {index !== 0
                    ? `to ${
                        getSpecificDates(
                          JSON.parse(data[0]['answer'])[index - 1]['date']
                        )['month']
                      } ${' '} ${
                        getSpecificDates(
                          JSON.parse(data[0]['answer'])[index - 1]['date']
                        )['year']
                      }`
                    : ``}
                </strong>
              </p>
            </div>
          </>
        );
      })}
    </>
  );
}

export function Health(data) {
  const formulator = (question: any) => {
    if (retrieveSectionName(question) === 'medical-needs') {
      if (normalizeString(question['answer']) === 'yes') {
        return 'I do';
      }
      if (normalizeString(question['answer']) === 'no') {
        return 'I do not';
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Health</h4>
      <p className="lbh-body-m">
        <strong>{`${formulator(data[0])}`}</strong> have{' '}
        {normalizeString(data[0]['answer']) === 'yes'
          ? 'a medical need that affects my housing needs'
          : 'any medical needs'}
      </p>
    </div>
  );
}

export function DisplayInfo({ question }: any): JSX.Element {
  const answerBuilder = (question: any) => {
    switch (
      question[0]['id'].substring(0, question[0]['id'].lastIndexOf('/'))
    ) {
      case 'immigration-status':
        return ImmigrationStatus(question);
      case '':
        return ResidentialStatus(question);
      case 'current-accommodation':
        return CurrentAccommodation(question);
      case 'my-situation':
        return MySituation(question);
      case 'income-savings':
        return IncomeSavings(question);
      case 'employment':
        return Employment(question);
      case 'medical-needs':
        return Health(question);
      case 'address-history':
        return AddressHistory(question);
    }
  };

  return <>{answerBuilder(question)}</>;
}

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
  if (!currentResident) {
    return <Custom404 />;
  }

  const onDelete = () => {};

  const formatDate = (date: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return date ? new Date(date).toLocaleDateString(undefined, options) : '';
  };

  const breadcrumbs = [
    {
      href: `/apply/overview/${currentResident.person?.id}`,
      name: 'Application',
    },
    {
      href: `/apply/${currentResident.person?.id}`,
      name: currentResident.person?.firstName || '',
    },
  ];

  let questions: any = currentResident.questions;
  questions = questions?.slice(1);

  const groupedSectionAnswers = questions?.reduce(
    (result: any, currentValue: any) => {
      let groupSection = currentValue.id.substring(
        0,
        currentValue.id.lastIndexOf('/')
      );

      const newCurrentValue = Object.assign({}, currentValue);

      const mySituationSectionNames = [
        'arrears',
        'homelessness',
        'property-ownership',
        'sold-property',
        'breach-of-tenancy',
        'legal-restrictions',
        'unspent-convictions',
      ];

      if (mySituationSectionNames.includes(groupSection)) {
        groupSection = 'my-situation';
        var selectBeforeFirstSlash = /^[^/]+/;

        newCurrentValue.id = newCurrentValue.id.replace(
          selectBeforeFirstSlash,
          'my-situation'
        );
      }

      result[groupSection] = result[groupSection] || [];
      result[groupSection].push(newCurrentValue);
      return result;
    },
    {}
  );

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <p className="lbh-body-m">Check answers for</p>
      <h3 className="lbh-heading-h3">
        {currentResident.person.firstName +
          ' ' +
          currentResident.person.surname}
      </h3>
      <br />
      <dl className="govuk-summary-list lbh-summary-list">
        Personal Details
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">
            {`${currentResident.person.firstName} ${currentResident.person.surname}`}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        {currentResident.person.dateOfBirth && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Date of birth</dt>
            <dd className="govuk-summary-list__value">
              {formatDate(currentResident.person.dateOfBirth)}
            </dd>
            <dd className="govuk-summary-list__actions"></dd>
          </div>
        )}
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Gender</dt>
          <dd className="govuk-summary-list__value">
            {currentResident.person?.gender}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">NI Number</dt>
          <dd className="govuk-summary-list__value">
            {getQuestionValue(
              currentResident.questions,
              FormID.PERSONAL_DETAILS,
              'nationalInsuranceNumber'
            )}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
      </dl>
      <br />
      {Object.keys(groupedSectionAnswers).map((question, index) => {
        return (
          <DisplayInfo question={groupedSectionAnswers[question]} key={index} />
        );
      })}

      <ButtonLink href="submit">I confirm this is correct</ButtonLink>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  );
};

export default UserSummary;
