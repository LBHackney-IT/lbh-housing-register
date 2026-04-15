import { GetServerSideProps } from 'next';
import { ButtonLink } from '../components/button';
import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/staff-layout';

interface LoginProps {
  loginUrl: string;
}

export default function LoginPage({ loginUrl }: LoginProps): JSX.Element {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error('Missing APP_URL');

  let redirect = context.query.redirect as string | undefined;
  if (!redirect || redirect === '/') redirect = '/applications';

  return {
    props: {
      loginUrl: `https://auth.hackney.gov.uk/auth?redirect_uri=${appUrl}${redirect}`,
    },
  };
};
