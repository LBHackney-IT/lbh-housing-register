import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { SyntheticEvent, useState } from 'react';
import { HackneyGoogleUser } from '../../../domain/HackneyGoogleUser';
import { UserContext } from '../../../lib/contexts/user-context';
import { getAuth, getSession } from '../../../lib/utils/googleAuth';
import Layout from '../../../components/layout/staff-layout';
import Sidebar from '../../../components/admin/sidebar';
import { HeadingOne } from '../../../components/content/headings';
import { listNovaletExports } from '../../../lib/gateways/applications-api';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../../components/admin/HorizontalNav';
import router from 'next/router';
import NovaletReports from './novalet';
import InternalReports from './internal';

interface ReportsProps {
  user: HackneyGoogleUser;
  reports: string[];
}

export default function Reports({ user, reports }: ReportsProps) {
  const [activeNavItem, setActiveNavItem] = useState('Novalet');

  const handleClick = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { name } = event.target as HTMLButtonElement;

    router.push({
      pathname: '/applications/reports',
      query: { status: name },
    });

    setActiveNavItem(name);
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Reports">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="Reports" />
            <HorizontalNav>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="Novalet"
                isActive={activeNavItem === 'Novalet'}
              >
                Novalet feed
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="Internal"
                isActive={activeNavItem === 'Internal'}
              >
                Internal reporting
              </HorizontalNavItem>
            </HorizontalNav>

            {activeNavItem == 'Novalet' && <NovaletReports {...reports} />}
            {activeNavItem == 'Internal' && <InternalReports />}
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

  const auth = getAuth(process.env.AUTHORISED_MANAGER_GROUP as string, user);

  if ('redirect' in auth) {
    return { redirect: auth.redirect };
  }

  const reportNames = await listNovaletExports();

  return {
    props: { user: auth.user, reports: reportNames },
  };
};
