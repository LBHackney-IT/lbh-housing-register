import { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import SummaryList, {
  SummaryListActions as Actions,
  SummaryListKey as Key,
  SummaryListRow as Row,
} from '../../components/summary-list';
import Tag from '../../components/tag';
import ApplicantName from '../../components/application/ApplicantName';
import { Applicant } from '../../domain/HousingApi';
import { useAppSelector } from '../../lib/store/hooks';
import { applicationStepsRemaining } from '../../lib/utils/resident';
import withApplication from '../../lib/hoc/withApplication';

const ApplicationPersonsOverview = (): JSX.Element => {
  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const application = useAppSelector((store) => store.application);
  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  return (
    <Layout pageName="Application overview" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Tasks to complete" />

      <SummaryList>
        {applicants.map((applicant, index) => {
          const tasksRemaining = applicationStepsRemaining(
            applicant,
            applicant === application.mainApplicant
          );
          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <ApplicantName
                  applicant={applicant}
                  isMainApplicant={applicant === application.mainApplicant}
                />
              </Key>
              <Actions>
                {tasksRemaining == 0 ? (
                  <Tag content="Completed" variant="green" />
                ) : (
                  <Tag
                    content={`${tasksRemaining} task${tasksRemaining > 1 ? 's' : ''
                      } to do`}
                  />
                )}
              </Actions>
            </Row>
          );
        })}
      </SummaryList>

      <ButtonLink href="/apply/household" secondary={true}>
        Edit my household
      </ButtonLink>

      {applicants.every(
        (applicant) =>
          applicationStepsRemaining(
            applicant,
            applicant === application.mainApplicant
          ) == 0
      ) && (
          <>
            <Paragraph>
              Please make sure you have checked your answers for each applicant.
            </Paragraph>
            <ButtonLink href='/apply/submit/additional-questions'>
              Save and continue
            </ButtonLink>
          </>
        )}
    </Layout>
  );
};

export default withApplication(ApplicationPersonsOverview);
