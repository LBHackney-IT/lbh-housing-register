import React from 'react';
import { GetServerSideProps } from 'next';
import { HeadingOne } from '../../../../../components/content/headings';

import Layout from '../../../../../components/layout/staff-layout';
import { Application } from '../../../../../domain/HousingApi';
import { UserContext } from '../../../../../lib/contexts/user-context';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../../lib/utils/googleAuth';
import Custom404 from '../../../../404';
import { HackneyGoogleUser } from '../../../../../domain/HackneyGoogleUser';

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
  person: string;
  evidenceLink: string;
}

export default function EditApplicant({
  user,
  data,
  person,
  evidenceLink,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Edit person">
        <HeadingOne content="Edit person" />
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  const { id, person } = context.params as {
    id: string;
    person: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  const evidenceLink = process.env.NEXT_PUBLIC_EVIDENCE_STORE || null;
  return { props: { user, data, person, evidenceLink } };
};
