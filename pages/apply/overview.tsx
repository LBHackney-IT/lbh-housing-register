import { useRouter } from 'next/router';
import Button, { ButtonLink } from '../../components/button';
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
import whenAgreed from '../../lib/hoc/whenAgreed';
import { useAppSelector, useAppDispatch } from '../../lib/store/hooks';
import { applicationStepsRemaining } from '../../lib/utils/resident';
import {
  sendConfirmation,
  completeApplication,
} from '../../lib/store/application';
import ErrorResponse from '../../components/errors/response';
import UserErrors from '../../components/errors/user';
import { useMemo, useState } from 'react';
import { checkEligible } from '../../lib/utils/form';

const ApplicationPersonsOverview = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userError, setUserError] = useState<string | null>(null);

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const application = useAppSelector((store) => store.application);
  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const eligibilityMap = useMemo(
    () =>
      new Map(
        applicants.map((applicant) => [applicant, checkEligible(applicant)[0]])
      ),
    [applicants]
  );

  const submitApplication = async () => {
    let isEligible = true;
    applicants.map((applicant, index) => {
      if (!eligibilityMap.get(applicant)) {
        isEligible = false;
      }
    });

    if (!isEligible) {
      router.push('/apply/not-eligible');
    } else {
      dispatch(sendConfirmation(application)).then(
        (sendConfirmationResult: any) => {
          dispatch(completeApplication(application)).then(
            (completeApplicationResult: any) => {
              if (
                !sendConfirmationResult.error ||
                !completeApplicationResult.error
              ) {
                router.push('/apply/submit/additional-questions');
              }
              if (sendConfirmationResult.error) {
                setUserError(ErrorResponse());
              }
              if (completeApplicationResult.error) {
                setUserError(ErrorResponse());
              }
            }
          );
        }
      );
    }
  };

  return (
    <Layout pageName="Application overview" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Tasks to complete" />
      {userError && <UserErrors>{userError}</UserErrors>}

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
          <Button onClick={submitApplication}>Submit application</Button>
        </>
      )}
    </Layout>
  );
};

export default whenAgreed(ApplicationPersonsOverview);
