import Layout from '../../../components/layout/resident-layout';
import { selectApplicant } from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import { ButtonLink } from '../../../components/button';
import Custom404 from '../../404';
import DeleteLink from '../../../components/delete-link';


interface DisplayProps {
  question: {
    id?: string | undefined;
    answer?: string | undefined;
  };
  person: {
    firstName: string;
    surname: string;
    dateOfBirth: Date;
    gender?: string;
    'national-insurance'?: string;
  };
}

export function DisplayInfo({
  question,
  person
}: DisplayProps):JSX.Element {

  const formatDate = (date: Date) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const
    return new Date(date).toLocaleDateString(undefined, options)
  } 

  return (
    <div>
      <dl className="govuk-summary-list lbh-summary-list">
        Personal Details
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">{person.firstName + ' ' + person.surname}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Date of birth</dt>
          <dd className="govuk-summary-list__value">{formatDate(person?.dateOfBirth)}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Gender</dt>
          <dd className="govuk-summary-list__value">{person?.gender}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">NI Number</dt>
          <dd className="govuk-summary-list__value">{person?.['national-insurance']}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
      </dl>
      <br />
      



      <dl className="govuk-summary-list lbh-summary-list">
        {question?.id}
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">{question?.id}</dt>
          <dd className="govuk-summary-list__value">{question?.answer}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
      </dl>
    </div>
  ) 
}


const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));

  const baseHref = `/apply/${currentResident?.person?.id}`;
  const returnHref = '/apply/overview';

  if (!currentResident) {
    return <Custom404 />;
  }

  const onDelete = () => {}

  const headerTitles = ['Immigration Status', 'Residential Status', 'Address Histoy', 'Current Accomodation', 
    'My Situation', 'Income & savings', 'Employment', 'Health'];

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: currentResident?.person?.firstName || '',
    },
  ];

  // Create a custom object that makes it easy to iterate over for DisplayInfo
  // const 

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <p className="lbh-body-m">Check answers for</p>
      <h3 className="lbh-heading-h3">{currentResident?.person.firstName + ' ' + currentResident?.person.surname}</h3>
      <br />
      {currentResident.questions?.map((question) => {
        return <DisplayInfo question={question} person={currentResident?.person} />
      })}
      <ButtonLink href="something">I confirm this is correct</ButtonLink>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  )
}

export default UserSummary;