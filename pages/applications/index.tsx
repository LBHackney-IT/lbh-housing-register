import { GetServerSideProps } from 'next';
import ApplicationTable from '../../components/applications/application-table';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/staff-layout';
import { Stats } from '../../components/stats';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { ApplicationList } from '../../domain/HousingApi';
import { Stat } from '../../domain/stat';
import { UserContext } from '../../lib/contexts/user-context';
import {
  getApplications,
  getStats,
  searchApplication,
} from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/auth';
import SearchBox from '../../components/applications/searchBox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PageProps {
  user: HackneyGoogleUser;
  applications: ApplicationList;
  stats: Array<Stat>;
}

export default function ApplicationListPage({
  user,
  applications,
  stats,
}: PageProps): JSX.Element {
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();

  const textChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ChangeEvent<HTMLInputElement> => {
    setsearchInputValue(event.target.value);
    return event;
  };

  const onSearchSubmit = async () => {
    router.push(window.location.pathname + '?searchterm=' + searchInputValue);
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout>
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search application reference"
          onSearch={onSearchSubmit}
          textChangeHandler={textChangeHandler}
        />
        <HeadingOne content="Staff dashboard" />
        {stats && (
          <Stats className="govuk-grid-column-one-third" stats={stats} />
        )}
        {applications.results?.length ? (
          <ApplicationTable
            caption="Applications"
            applications={applications}
          />
        ) : (
          <Paragraph>No applications to show</Paragraph>
        )}
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(
    process.env.AUTHORISED_ADMIN_GROUP as string,
    user
  );
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  const { searchterm } = context.query as {
    searchterm: string;
  };

  const applications =
    searchterm === undefined
      ? await getApplications()
      : await searchApplication(searchterm);

  const stats = await getStats();

  return { props: { user, applications, stats } };
};
