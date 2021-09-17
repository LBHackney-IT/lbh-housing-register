import { GetServerSideProps } from 'next';
import React from 'react';
import AddressDetails from '../../../../../components/applications/address-details';
import ContactDetails from '../../../../../components/applications/contact-details';
import PersonalDetails from '../../../../../components/applications/personal-details';
import {
  HeadingOne,
  HeadingTwo,
} from '../../../../../components/content/headings';
import Layout from '../../../../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../../domain/HousingApi';
import { UserContext } from '../../../../../lib/contexts/user-context';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../../lib/utils/auth';
import Custom404 from '../../../../404';

export function formatDate(date: string | undefined) {
  if (!date) return '';
  return `${new Date(date).toLocaleString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
  person: string;
}

export default function ApplicationPersonPage({
  user,
  data,
  person,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;
  let isMainApplicant = data.mainApplicant?.person?.id === person;
  let applicant = isMainApplicant
    ? data.mainApplicant
    : data.otherMembers?.find((x) => x.person?.id === person);

  return (
    <UserContext.Provider value={{ user }}>
      <Layout>
        <HeadingOne
          content={
            isMainApplicant
              ? 'Review main applicant'
              : 'Review household member'
          }
        />
        <HeadingTwo
          content={`${applicant?.person?.firstName} ${applicant?.person?.surname}`}
        />

        <hr />
        {applicant && (
          <PersonalDetails
            heading="Personal details"
            applicant={applicant}
            applicationId={data.id}
          />
        )}
        {applicant?.contactInformation && (
          <ContactDetails
            heading="Contact details"
            contact={applicant.contactInformation}
          />
        )}
        {applicant?.address && (
          <AddressDetails
            heading="Address details"
            address={applicant.address}
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

  console.log(context.params);
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

  return { props: { user, data, person } };
};
