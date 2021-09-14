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

  const signOut = () => {
    dispatch(signOut());
    router.push('/');
  };

  return (
    <Layout pageName="Confirmation">
      <Panel
        heading="Application complete"
        message={`Your reference number: ${application.reference?.toUpperCase()}`}
      />

      <HeadingTwo content="What happens next" />
      <Timeline>
        <TimelineEvent heading="Application submitted" variant="action-needed">
          <Paragraph>{formatDate(application.submittedAt)}</Paragraph>
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

export default withApplication(ApplicationConfirmation);
