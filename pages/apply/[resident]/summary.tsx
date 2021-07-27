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
}

export function DisplayInfo({
  question,
}: DisplayProps):JSX.Element {

  const formatHeader = (header: any) => {
    header = header.replace(/-|\s+/g, ' ').toUpperCase();
    header = header.substring(0, header.lastIndexOf("/"));
    return header;
  }

  return (
    <div style={{"borderBottom": "1px solid", "color": "#b1b4b6"}}> 
      <h4 className="lbh-heading-h4">{formatHeader(question?.id)}</h4>
      <p className="lbh-body-m">{question?.answer}</p>
    </div>
  ) 
}


const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));

  const baseHref = `/apply/${currentResident?.person?.id}`;
  const returnHref = `/apply/overview/${currentResident?.person?.id}`;

  if (!currentResident) {
    return <Custom404 />;
  }

  const onDelete = () => {};

  const formatDate = (date: Date | undefined | string) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const
    return date ? new Date(date).toLocaleDateString(undefined, options) : ''
  };

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
  let questions = currentResident.questions;
  questions = questions?.slice(1);

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <p className="lbh-body-m">Check answers for</p>
      <h3 className="lbh-heading-h3">{currentResident?.person.firstName + ' ' + currentResident?.person.surname}</h3>
      <br />
      <dl className="govuk-summary-list lbh-summary-list">
        Personal Details
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">{currentResident?.person.firstName + ' ' + currentResident?.person.surname}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Date of birth</dt>
          <dd className="govuk-summary-list__value">{formatDate(currentResident?.person?.dateOfBirth)}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Gender</dt>
          <dd className="govuk-summary-list__value">{currentResident?.person?.gender}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">NI Number</dt>
          <dd className="govuk-summary-list__value">{currentResident?.person?.['national-insurance']}</dd>
          <dd className="govuk-summary-list__actions">
          </dd>
        </div>
      </dl>
      <br />
      {questions?.map((question, index) => {
        return <DisplayInfo question={question} key={index} />
      })}
      <ButtonLink href="submit">I confirm this is correct</ButtonLink>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  )
}

export default UserSummary;