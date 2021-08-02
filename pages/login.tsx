import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ButtonLink } from '../components/button';
import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/resident-layout';

interface LoginProps {
  appUrl: string;
}

export default function LoginPage({ appUrl }: LoginProps): JSX.Element {
  const router = useRouter();
  const loginUrl = useMemo(() => {
    let { redirect } = router.query as { redirect?: string };
    if (!redirect || redirect == '/') redirect = '/applications';
    return `https://auth.hackney.gov.uk/auth?redirect_uri=${appUrl}${redirect}`;
  }, [router, appUrl]);

  return (
    <Layout pageName="Staff login">
      <HeadingOne content="Staff login" />
      <ButtonLink href={loginUrl}>Sign in with Google</ButtonLink>
      <Paragraph>Please sign in with your Hackney email account.</Paragraph>
      <Paragraph>
        Speak to your manager if you have issues logging in.
      </Paragraph>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error('Missing APP_URL');

  return { props: { appUrl } };
};
