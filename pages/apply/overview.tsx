import Link from 'next/link';
import { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import {
  SummaryListSpaced,
  SummaryListKey as Key,
  SummaryListRow as Row,
} from '../../components/summary-list';
import ApplicantSummary from '../../components/application/ApplicantSummary';
import { selectApplicantsMemorised } from '../../lib/store/applicant';
import { useAppSelector } from '../../lib/store/hooks';
import { applicationSteps } from '../../lib/utils/resident';
import withApplication from '../../lib/hoc/withApplication';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { scrollToError } from 'lib/utils/scroll';
import ErrorSummary from 'components/errors/error-summary';

const ApplicationPersonsOverview = (): JSX.Element => {
  const [userError, setUserError] = useState<string | null>(null);
  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const { query } = useRouter();

  useEffect(() => {
    if (query.error) {
      setUserError(query.error as string);
      scrollToError();
    }
  }, [query]);

  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const application = useAppSelector((store) => store.application);
  const applicants = useAppSelector(selectApplicantsMemorised);

  const applicantsCompletedCount = applicants.filter((applicant) => {
    const tasks = applicationSteps(
      applicant,
      applicant === application.mainApplicant
    );
    return tasks.remaining === 0;
  }).length;

  return (
    <>
      <Layout
        pageName="Application overview"
        breadcrumbs={breadcrumbs}
        dataTestId="test-apply-resident-overview-page"
      >
        <HeadingOne content="Provide information about your household" />
        <p className="lbh-body lbh-body-l lbh-body--grey">
          You've completed information for {applicantsCompletedCount} of{' '}
          {applicants.length} people.
        </p>
        {userError && (
          <ErrorSummary dataTestId="test-apply-overciw-error-summary">
            {userError}
          </ErrorSummary>
        )}
        <SummaryListSpaced>
          {applicants.map((applicant, index) => {
            const tasks = applicationSteps(
              applicant,
              applicant === application.mainApplicant
            );

            return (
              <Row key={index} verticalAlign="middle">
                <Key>
                  <ApplicantSummary
                    applicant={applicant}
                    isMainApplicant={applicant === application.mainApplicant}
                    mainApplicantCompleted={
                      mainResident
                        ? applicationSteps(mainResident, true).remaining === 0
                        : false
                    }
                    applicantNumber={index + 1}
                    tasks={tasks}
                    applicantLinkTestId={applicant.person?.id}
                  />
                </Key>
                {/* <Actions>
                  {tasksRemaining == 0 ? (
                    <Tag content="Completed" variant="green" />
                  ) : (
                    <Tag
                      content={`${tasksRemaining} task${
                        tasksRemaining > 1 ? 's' : ''
                      } to do`}
                    />
                  )}
                </Actions> */}
              </Row>
            );
          })}
        </SummaryListSpaced>

        <Paragraph>
          <Link href="/apply/household">
            <a className="lbh-body-s lbh-link lbh-link--no-visited-state ">
              Edit my household
            </a>
          </Link>
        </Paragraph>

        {applicants.every(
          (applicant) =>
            applicationSteps(applicant, applicant === application.mainApplicant)
              .remaining == 0
        ) && (
          <>
            <Paragraph>
              Please make sure you have checked your answers for each applicant.
            </Paragraph>
            <ButtonLink href="/apply/submit/additional-questions">
              Save and continue
            </ButtonLink>
          </>
        )}
      </Layout>
    </>
  );
};

export default withApplication(ApplicationPersonsOverview);
