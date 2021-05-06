import Layout from '../components/layout/resident-layout';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ButtonLink } from "../components/button"
import { HeadingOne } from "../components/headings"
import Paragraph from '../components/paragraph';

interface LoginProps {
  appUrl: string
}

export default function LoginPage({ appUrl }: LoginProps): JSX.Element {

  const router = useRouter();
  const loginUrl = useMemo(() => {
    let { redirect } = router.query as { redirect?: string };
    if (!redirect || redirect == '/') redirect = '/applications';
    return `https://auth.hackney.gov.uk/auth?redirect_uri=${appUrl}${redirect}`;
  }, [router, appUrl]);

  return (
    <Layout>
      <HeadingOne content="Staff login" />
      <ButtonLink href={loginUrl}>Sign in with Google</ButtonLink>
      <Paragraph content="Please sign in with your Hackney email account." />
      <Paragraph content="Speak to your manager if you have issues logging in." />
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error('Missing APP_URL');

  return { props: { appUrl } };
};
