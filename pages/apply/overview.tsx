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
import { Applicant, Application } from '../../domain/HousingApi';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { applicationStepsRemaining } from '../../lib/utils/resident';
import {
  sendConfirmation,
  completeApplication,
  sendDisqualifyEmail,
  loadApplication,
  importApplication,
} from '../../lib/store/application';
import { checkEligible } from '../../lib/utils/form';
import withApplication from '../../lib/hoc/withApplication';
import Custom404 from '../404';
import { GetServerSideProps } from 'next';
import { getApplication } from '../../lib/gateways/applications-api';
import { getUser } from '../../lib/utils/users';
import { useEffect } from 'react';

interface PageProps {
  data: Application;
}

const ApplicationPersonsOverview = ({data}: PageProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      importApplication(data)
    );
  }, []);

  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  if (!mainResident) {
    return <Custom404 />;
  }

  const application = useAppSelector((store) => store.application);
  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const submitApplication = async () => {
    const [isEligible] = checkEligible(mainResident);
    if (!isEligible) {
      dispatch(sendDisqualifyEmail(application));
      router.push('/apply/not-eligible');
    } else {
      dispatch(sendConfirmation(application));
      dispatch(completeApplication(application));
      router.push('/apply/submit/additional-questions');
    }
  };

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

export default ApplicationPersonsOverview;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get current user from session (JWT cookie)
  const user = getUser(context.req);
  console.log(user);

  // the JWT should have an application id
  const id = user?.application_id;
  if (!id) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }

  const data = await getApplication(id);
  return {
    props: { data },
  };
};
