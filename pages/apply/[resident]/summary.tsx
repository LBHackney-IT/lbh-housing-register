import Layout from '../../../components/layout/resident-layout';
import { selectApplicant } from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import Custom404 from '../../404';
import { ButtonLink } from '../../../components/button';
import DeleteLink from '../../../components/delete-link';
import { SummaryInfo } from '../../../components/summary/SummaryInfo';
import PersonalDetailsSummary from '../../../components/summary/PersonalDetails';

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
  if (!currentResident) {
    return <Custom404 />;
  }

  const baseHref = `/apply/${currentResident.person?.id}`;
  const returnHref = '/apply/overview';

  const onDelete = () => {
    // TODO: delete applicant
    router.push(returnHref);
  };

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
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
    <Layout pageName="Application summary" breadcrumbs={breadcrumbs}>
      <h1 className="lbh-heading-h1">
        <span className="govuk-hint lbh-hint">Check answers for:</span>
        {currentResident.person?.firstName} {currentResident.person?.surname}
      </h1>

      <PersonalDetailsSummary currentResident={currentResident} />

      {Object.keys(groupedSectionAnswers).map((question, index) => {
        return (
          <SummaryInfo
            currentResident={currentResident}
            question={groupedSectionAnswers[question]}
            key={index} />
        );
      })}

      <ButtonLink href="/apply/overview">I confirm this is correct</ButtonLink>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  );
};

export default UserSummary;
