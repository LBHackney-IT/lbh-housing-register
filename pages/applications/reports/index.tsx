import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React from 'react';
import { HackneyGoogleUser } from '../../../domain/HackneyGoogleUser';
import { UserContext } from '../../../lib/contexts/user-context';
import { getAuth, getSession } from '../../../lib/utils/googleAuth';
import Layout from '../../../components/layout/staff-layout';
import Sidebar from '../../../components/admin/sidebar';
import { ButtonLink } from '../../../components/button';
import { HeadingOne } from '../../../components/content/headings';

interface ReportsProps {
  user: HackneyGoogleUser;
}

export default function Reports({ user }: ReportsProps) {
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Reports">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="Generate a report" />
            <ButtonLink href="/api/applications/generate-report">
              Download .CSV file
            </ButtonLink>
          </div>
        </div>
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
