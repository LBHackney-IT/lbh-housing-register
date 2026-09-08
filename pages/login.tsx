import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { signIn } from 'next-auth/react';

import Button from '../components/button';
import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/staff-layout';
import { safeStaffReturnPath } from '../lib/auth/redirects';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const returnTo = useMemo(
    () => safeStaffReturnPath(router.query.returnTo),
    [router.query.returnTo],
  );

  return (
    <Layout pageName="Staff login">
      <HeadingOne content="Staff login" />
      <Button
        type="button"
        onClick={() => void signIn('cognito', { callbackUrl: returnTo })}
      >
        Sign in with Google
      </Button>
      <Paragraph>Please sign in with your Hackney email account.</Paragraph>
      <Paragraph>
        Speak to your manager if you have issues logging in.
      </Paragraph>
    </Layout>
  );
}
