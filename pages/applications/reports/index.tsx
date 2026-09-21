import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { MouseEvent, useState } from 'react';
import { StaffUser } from '../../../domain/StaffUser';
import { authorizeStaffPage } from '../../../lib/auth/page';
import { UserContext } from '../../../lib/contexts/user-context';
import Layout from '../../../components/layout/staff-layout';
import Sidebar from '../../../components/admin/sidebar';
import { HeadingOne } from '../../../components/content/headings';
import { listNovaletExports } from '../../../lib/gateways/applications-api';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../../components/admin/HorizontalNav';
import router from 'next/router';
import NovaletReports from '../../../components/admin/NovaletReports';
import InternalReports from '../../../components/admin/InternalReports';
import SearchBox from '../../../components/admin/SearchBox';

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
  user: StaffUser;
  reportsData: Report[];
}

export default function Reports({
  user,
  reportsData,
}: ReportsProps): JSX.Element {
  const [activeNavItem, setActiveNavItem] = useState('Novalet');

  const handleSelectNavItem = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { name } = event.currentTarget;

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
  context,
): Promise<GetServerSidePropsResult<ReportsProps>> => {
  const authorization = await authorizeStaffPage(context, {
    requiredGroup: process.env.AUTHORISED_MANAGER_GROUP as string,
  });
  if ('redirect' in authorization) return authorization;
  const { user } = authorization;

  const reportNames = (await listNovaletExports(30)) as Report[];

  return {
    props: { user, reportsData: reportNames },
  };
};
