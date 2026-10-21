import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';

import Button from '../components/button';
import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/staff-layout';
import Loading from '../components/loading';
import { safeStaffReturnPath } from '../lib/auth/redirects';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const returnTo = useMemo(
    () => safeStaffReturnPath(router.query.returnTo),
    [router.query.returnTo],
  );

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn('cognito', { callbackUrl: returnTo });
    } catch {
      setIsSigningIn(false);
    }
  };

  return (
    <Layout pageName="Staff login">
      <HeadingOne content="Staff login" />
      {isSigningIn ? (
        <Loading text="Signing in…" />
      ) : (
        <Button type="button" onClick={() => void handleSignIn()}>
          Sign in with Google
        </Button>
      )}
      <Paragraph>Please sign in with your Hackney email account.</Paragraph>
      <Paragraph>
        Speak to your manager if you have issues logging in.
      </Paragraph>
    </Layout>
  );
}
