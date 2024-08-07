import React, { SyntheticEvent, useState } from 'react';

import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import router from 'next/router';

import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../../components/admin/HorizontalNav';
import InternalReports from '../../../components/admin/InternalReports';
import NovaletReports from '../../../components/admin/NovaletReports';
import SearchBox from '../../../components/admin/SearchBox';
import Sidebar from '../../../components/admin/sidebar';
import { HeadingOne } from '../../../components/content/headings';
import Layout from '../../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../../domain/HackneyGoogleUser';
import { UserContext } from '../../../lib/contexts/user-context';
import { listNovaletExports } from '../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../lib/utils/googleAuth';

export interface Report {
  fileName: string;
  lastModified: string;
  size: number;
  attributes: {
    approvedOn: string;
    lastDownloadedOn: string;
    approvedBy: string;
  };
  applicationLinksFileName?: string;
}

interface ReportsProps {
  user: HackneyGoogleUser;
  reportsData: Report[];
}

export default function Reports({
  user,
  reportsData,
}: ReportsProps): JSX.Element {
  const [activeNavItem, setActiveNavItem] = useState('Novalet');

  const handleSelectNavItem = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { name } = event.target as HTMLButtonElement;

    router.push({
      query: { status: name },
    });

    setActiveNavItem(name);
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Reports">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search all applications (name, reference, bidding number)"
        />

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="Reports" />
            <HorizontalNav>
              <HorizontalNavItem
                handleSelectNavItem={handleSelectNavItem}
                itemName="Novalet"
                isActive={activeNavItem === 'Novalet'}
              >
                Novalet applicant feed
              </HorizontalNavItem>
              <HorizontalNavItem
                handleSelectNavItem={handleSelectNavItem}
                itemName="Internal"
                isActive={activeNavItem === 'Internal'}
              >
                Internal reporting
              </HorizontalNavItem>
            </HorizontalNav>

            {activeNavItem == 'Novalet' && (
              <NovaletReports reports={reportsData} />
            )}
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

  const reportNames = await listNovaletExports(30);

  return {
    props: { user: auth.user, reportsData: reportNames },
  };
};
