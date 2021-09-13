import { GetServerSideProps } from 'next';
import ApplicationTable from '../../components/applications/application-table';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { ApplicationList } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import {
  getApplications,
  searchApplication,
} from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/auth';
import SearchBox from '../../components/applications/searchBox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PageProps {
  user: HackneyGoogleUser;
  applications: ApplicationList;
}

export default function ApplicationListPage({
  user,
  applications,
}: PageProps): JSX.Element {
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();

  type State = 'new-applications' | 'pending-applications';
  const [state, setState] = useState<State>('new-applications');

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
      <Layout pageName="Manage applications">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search application reference"
          onSearch={onSearchSubmit}
          textChangeHandler={textChangeHandler}
        />
        <HeadingOne content="View housing register" />

        <button
          onClick={() => {
            setState('new-applications');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          New applications
        </button>
        <button
          onClick={() => {
            setState('pending-applications');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Pending applications
        </button>

        {state == 'new-applications' && (
          <ApplicationTable
            caption="Applications"
            applications={applications.results?.filter(x => x.status === 'New') ?? []}
          />
        )}
        {state == 'pending-applications' && (
          <ApplicationTable
            caption="Applications"
            applications={applications.results?.filter(x => x.status === 'Pending') ?? []}
          />
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

  return { props: { user, applications } };
};
