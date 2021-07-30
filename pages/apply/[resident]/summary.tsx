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

interface DisplayProps {
  question: {
    id?: string | undefined;
    answer?: string | undefined;
  };
}

// Date types have been ignored for the most parts and need serious attention!!!

const retrieveSectionName = (question: any) => {
  return question['id'].substr(question['id'].lastIndexOf('/') + 1);
};

const normalizeString = (answer: string) => {
  return answer.replace(/[^a-zA-Z ]/g, '');
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
      <p className="lbh-body-m">{`I am ${formulator(data[0])} citizen ${
        data[1] ? formulator(data[1]) : ''
      } ${data[2] ? formulator(data[2]) : ''}`}</p>
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
  console.log('Current Accommodation data', data);

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
        <p className="lbh-body-m">{`I am living with ${formulator(
          data[0]
        )}`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`I live in a ${formulator(data[1])}`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`My home is on floor ${formulator(
          data[2]
        )}`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`I share my home with ${formulator(
          data[3]
        )} people not included in this application`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`My home has ${data[4]['answer']} bedroom(s)`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`My home has ${data[5]['answer']} bathrooms`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`My home has ${data[6]['answer']} kitchen`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`My home has ${data[7]['answer']} other rooms`}</p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">{`I have ${data[8]['answer']} rooms for my own personal use`}</p>
      </div>
    </>
  );
}

export function MySituation(data) {
  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">My Situation</h4>
      <p className="lbh-body-m"></p>
    </div>
  );
}

export function IncomeSavings(data) {
  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Income & savings</h4>
      <p className="lbh-body-m"></p>
    </div>
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
      <p className="lbh-body-m">{`I am ${formulator(data[0])}`}</p>
    </div>
  );
}

export function Health(data) {
  const formulator = (question: any) => {
    if (retrieveSectionName(question) === 'medical-needs') {
      if (normalizeString(question['answer']) === 'yes') {
        return 'I do have a medical needs that affects my housing needs';
      }
      if (normalizeString(question['answer']) === 'no') {
        return 'I do not have any medical needs';
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h4 className="lbh-heading-h4">Health</h4>
      <p className="lbh-body-m">{formulator(data[0])}</p>
    </div>
  );
}

export function DisplayInfo({ question }: any): JSX.Element {
  const formatHeader = (header: any) => {
    header = header.replace(/-|\s+/g, ' ').toUpperCase();
    header = header.substring(0, header.lastIndexOf('/'));
    return header;
  };

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
      case '':
        return MySituation(question);
      case 'income-savings':
        return IncomeSavings(question);
      case 'employment':
        return Employment(question);
      case 'medical-needs':
        return Health(question);
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

      result[groupSection] = result[groupSection] || [];
      result[groupSection].push(currentValue);
      return result;
    },
    {}
  );

  // console.log('what is groupedAnswers', groupedSectionAnswers);

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
