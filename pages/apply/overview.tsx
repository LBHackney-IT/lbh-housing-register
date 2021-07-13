import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import Button, { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Hint from '../../components/form/hint';
import Layout from '../../components/layout/resident-layout';
import SummaryList, {
    SummaryListActions as Actions,
    SummaryListKey as Key,
    SummaryListRow as Row
} from '../../components/summary-list';
import Tag from '../../components/tag';
import { Applicant } from '../../domain/HousingApi';
import whenAgreed from '../../lib/hoc/whenAgreed';
import { useAppSelector } from '../../lib/store/hooks';
import { checkEligible } from '../../lib/utils/form';
import { applicationStepsRemaining } from '../../lib/utils/resident';


const ApplicationPersonsOverview = (): JSX.Element => {
  const router = useRouter();

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );
  const eligibilityMap = useMemo(
    () =>
      new Map(
        applicants.map((applicant) => [applicant, checkEligible(applicant)[0]])
      ),
    [applicants]
  );

  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );

  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="My household" />

      <SummaryList>
        {applicants.map((applicant, index) => {
          const tasksRemaining = applicationStepsRemaining(
            applicant,
            applicant === mainApplicant
          );

          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <>
                  <Hint
                    content={
                      `Person ${index + 1}` +
                      (applicants.length > 1 && applicant === mainApplicant
                        ? ' (you)'
                        : '')
                    }
                  />
                  <Link href={`/apply/${applicant.person?.id}`}>
                    {`${applicant.person?.firstName} ${applicant.person?.surname}`}
                  </Link>
                </>
              </Key>
              <Actions>
                {!eligibilityMap.get(applicant) ? (
                  <Tag content="Not eligible" variant="red" />
                ) : tasksRemaining == 0 ? (
                  <Tag content="Completed" variant="green" />
                ) : (
                  <Tag
                    content={`${tasksRemaining} task${
                      tasksRemaining > 1 ? 's' : ''
                    } to do`}
                  />
                )}
              </Actions>
            </Row>
          );
        })}
      </SummaryList>

      <ButtonLink href="/apply/add-resident" secondary={true}>
        Add a person
      </ButtonLink>

      {applicants.every(
        (applicant) =>
          applicationStepsRemaining(applicant, applicant === mainApplicant) == 0
      ) && (
        <>
          <Paragraph>
            The button below only shows when all tasks are complete.
          </Paragraph>
          <Button>Submit application</Button>
        </>
      )}
    </Layout>
  );
};

export default whenAgreed(ApplicationPersonsOverview);
