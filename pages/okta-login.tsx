import { signIn } from 'next-auth/client';
import Layout from '../components/layout/staff-layout';
import { HeadingOne } from 'components/content/headings';
import Button from 'components/button';
import Paragraph from 'components/content/paragraph';

export default function OktaLogin() {
  return (
    <Layout pageName="Staff login - Okta">
      <HeadingOne content="Login" />
      <Paragraph>Please sign in with your Okta account</Paragraph>

      <Button onClick={() => signIn('okta')}>Sign in with Okta</Button>
    </Layout>
  );
}
