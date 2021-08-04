import { useAppDispatch } from '../../lib/store/hooks';
import { useRouter } from 'next/router';
import { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import DeleteLink from '../../components/delete-link';
import Announcement from '../../components/announcement';
import { signOut } from '../../lib/store/cognitoUser';

const WhatToExpect = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onCancel = () => {
    dispatch(signOut());
    router.push('/');
  };

  return (
    <Layout pageName="What to expect">
      <HeadingOne content="What to expect" />
      <Announcement variant="success">
        <Paragraph>
          If you qualify for the housing register, you may be able to apply for
          a <strong>two bedroom</strong> property.
        </Paragraph>
        <Paragraph>
          The average waiting timefor a two bedroom property is{' '}
          <strong>11 years.</strong>
        </Paragraph>
        <Paragraph>
          Next, you will need to complete more information to determine if you
          qualify for the housing register.
        </Paragraph>
      </Announcement>

      <ButtonLink href="/apply/overview">Save and continue</ButtonLink>
      <DeleteLink content="Cancel this application" onDelete={onCancel} />
    </Layout>
  );
};

export default WhatToExpect;
