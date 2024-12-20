import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { useRouter } from 'next/router';
import { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import DeleteLink from '../../components/delete-link';
import Announcement from '../../components/announcement';
import { getWaitingTime } from '../../lib/utils/bedroomWaitingTime';
import withApplication from '../../lib/hoc/withApplication';
import { exit } from '../../lib/store/auth';

const WhatToExpect = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onCancel = () => {
    // TODO: delete application
    router.push('/');
    dispatch(exit());
  };

  const application = useAppSelector((store) => store.application);
  const bedroomNeed = application.calculatedBedroomNeed!;

  const waitingTime = getWaitingTime(bedroomNeed);

  return (
    <Layout pageName="What to expect">
      <HeadingOne content="What to expect" />
      <Announcement variant="success">
        <Paragraph>
          Based on the information you have provided about who you want to move
          with, you may be able to apply for a{' '}
          <strong>{bedroomNeed} bedroom</strong> property.
        </Paragraph>
        <Paragraph>
          The average waiting time for a <strong>{bedroomNeed}</strong> bedroom
          property is <strong>{waitingTime} years.</strong>
        </Paragraph>
      </Announcement>
      <Paragraph>
        Next, you will need to complete more information to determine if you
        qualify to join the housing register.
      </Paragraph>

      <ButtonLink
        href="/apply/overview"
        dataTestId="test-apply-expect-save-and-continue-button"
      >
        Save and continue
      </ButtonLink>
      <DeleteLink content="Cancel this application" onDelete={onCancel} />
    </Layout>
  );
};

export default withApplication(WhatToExpect);
