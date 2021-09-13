import { GetServerSideProps } from 'next';
import ApplicationTable from '../../components/applications/application-table';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { searchApplication } from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/auth';
import SearchBox from '../../components/applications/searchBox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PageProps {
  user: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse;
  pageurl: string;
  page: string;
  nationalInsurance: string;
  reference: string;
  surname: string;
  orderby: string;
}

export default function ApplicationListPage({
  user,
  applications,
  pageurl,
  page,
  nationalInsurance,
  reference,
  surname,
  orderby,
}: PageProps): JSX.Element {
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();

  type State = 'new-applications' | 'pending-applications';
  const [state, setState] = useState<State>('new-applications');

  const parameters = new URLSearchParams();

  if (nationalInsurance !== undefined) {
    parameters.append('nationalInsurance', nationalInsurance);
  }

  if (reference !== undefined) {
    parameters.append('reference', reference);
  }

  if (surname !== undefined) {
    parameters.append('surname', surname);
  }

  if (orderby !== undefined) {
    parameters.append('orderby', orderby);
  }

  const parsedPage = page === undefined ? 1 : parseInt(page);

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
            applications={applications}
            currentPage={parsedPage}
            parameters={parameters}
            pageurl={pageurl}

            // applications={
            //   applications.results?.filter((x) => x.status === 'New') ?? []
            // }
          />
        )}
        {state == 'pending-applications' && (
          <ApplicationTable
            caption="Applications"
            applications={applications}
            currentPage={parsedPage}
            parameters={parameters}
            pageurl={pageurl}

            // applications={
            //   applications.results?.filter((x) => x.status === 'Pending') ?? []
            // }
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

  const { page, orderby, nationalInsurance, reference, surname } =
    context.query as {
      page: string;
      nationalInsurance: string;
      reference: string;
      surname: string;
      orderby: string;
    };

  // const applications =
  //   searchterm === undefined
  //     ? await getApplications()
  //     : await searchApplication(searchterm);

  const pageurl = `http://${context.req.headers.host}/applications`;

  const currentpage: number = page !== undefined ? +page : 1;
  const nt = nationalInsurance === undefined ? '' : nationalInsurance;
  const refNo = reference === undefined ? '' : reference;
  const sname = surname === undefined ? '' : surname;
  const order = orderby === undefined ? '' : orderby;

  const applications = await searchApplication(currentpage.toString());

  return {
    props: {
      user,
      applications,
      currentpage,
      pageurl,
      page,
      nt,
      refNo,
      sname,
      order,
    },
  };
};
