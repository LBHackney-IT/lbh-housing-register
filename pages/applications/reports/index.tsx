import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { ButtonLink } from '../../../components/button';
import Layout from '../../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../../domain/HackneyGoogleUser';
import { UserContext } from '../../../lib/contexts/user-context';
import { getAuth, getSession } from '../../../lib/utils/auth';

interface ReportsProps {
  user: HackneyGoogleUser;
}

export default function Reports({ user }: ReportsProps) {
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Reports">
        <ButtonLink href="/api/applications/generate-report">
          Download .CSV file
        </ButtonLink>
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<GetServerSidePropsResult<ReportsProps>> => {
  const user = getSession(context.req);

  const auth = getAuth(process.env.AUTHORISED_ADMIN_GROUP as string, user);

  if ('redirect' in auth) {
    return { redirect: auth.redirect };
  }

  return {
    props: { user: auth.user },
  };
};
