import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Button from '../../components/button';
import { HeadingTwo } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import Panel from '../../components/panel';
import Timeline, { TimelineEvent } from '../../components/timeline';
import withApplication from '../../lib/hoc/withApplication';
import { useAppSelector } from '../../lib/store/hooks';
import { formatDate } from '../../lib/utils/dateOfBirth';

const ApplicationConfirmation = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const application = useAppSelector((store) => store.application);
  const residentEmail = useAppSelector(
    (store) => store.cognitoUser?.attributes.email
  );

  const signOut = () => {
    dispatch(signOut());
    router.push('/');
  };

  return (
    <Layout pageName="Confirmation">
      <Panel heading="Application complete">
        <>
          {`Your reference number: ${application.reference?.toUpperCase()}`}
          <br />
          <span
            style={{
              display: 'block',
              fontSize: '1.2rem',
              overflowWrap: 'break-word',
            }}
          >
            {`We have sent a confirmation email to ${residentEmail}`}
          </span>
        </>
      </Panel>

      <HeadingTwo content="What happens next" />
      <Timeline>
        <TimelineEvent heading="Application submitted" variant="action-needed">
          <Paragraph>{formatDate(application.submittedAt)}</Paragraph>
        </TimelineEvent>
        <TimelineEvent heading="Upload Evidence">
          <Paragraph>
            You'll shortly receive an email with instructions on how to submit
            your documents and, if required, a medical form.
          </Paragraph>
        </TimelineEvent>
        <TimelineEvent heading="Application review">{}</TimelineEvent>
        <TimelineEvent heading="Decision">
          <Paragraph>
            We aim to contact you with a decision by email within 20 working
            days after receiving all information and documents from yourself and
            third parties.
          </Paragraph>
          <Paragraph>
            If your application is not successful, we will offer you advice on
            next steps, based on your situation. You will have the right to
            appeal the decision.
          </Paragraph>
        </TimelineEvent>
      </Timeline>

      <Button onClick={signOut}>Sign out</Button>
    </Layout>
  );
};

export default withApplication(ApplicationConfirmation);
