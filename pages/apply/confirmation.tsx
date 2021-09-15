import app from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../components/button';
import { HeadingTwo } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import Panel from '../../components/panel';
import Timeline, { TimelineEvent } from '../../components/timeline';
import { useAppSelector } from '../../lib/store/hooks';
import { formatDate } from '../../lib/utils/addressHistory';

const ApplicationConfirmation = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const application = useAppSelector((store) => store.application);
  const residentEmail = useAppSelector(
    (store) => store.cognitoUser?.attributes.email
  );

  useEffect(() => {
    if (!application) {
      router.replace('/');
    }
  }, [application]);

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
          <span style={{ display: 'block', fontSize: '1.2rem', overflowWrap: 'break-word' }}>
            {`We have sent a confirmation email to ${residentEmail}`}
          </span>
        </>
      </Panel>

      <HeadingTwo content="What happens next" />
      <Timeline>
        <TimelineEvent heading="Application submitted" variant="action-needed">
          <Paragraph>
            {application.submittedAt || 'date not available'}
          </Paragraph>
        </TimelineEvent>
        <TimelineEvent heading="Application review">
          <Paragraph>We aim to review applications within two weeks.</Paragraph>
        </TimelineEvent>
        <TimelineEvent heading="Medical checks">
          <Paragraph>
            If you have provided information about medical conditions for people
            in your application, these will be assessed by a specialist.
          </Paragraph>
        </TimelineEvent>
        <TimelineEvent heading="Decision">
          <Paragraph>
            We will contact you with a decision by SMS and email when your
            application has been assessed.
          </Paragraph>
          <Paragraph>
            If your application is not successful, we will be ale to offer
            tailored adice based on your situation. You will have the right to
            appeal the decision.
          </Paragraph>
        </TimelineEvent>
      </Timeline>

      <Button onClick={signOut}>Sign out</Button>
    </Layout>
  );
};

export default ApplicationConfirmation;
