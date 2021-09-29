import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import OtherMembers from '../../../../components/applications/other-members';
import PersonalDetails from '../../../../components/applications/personal-details';
import {
  HeadingOne,
  HeadingThree,
} from '../../../../components/content/headings';
import Paragraph from '../../../../components/content/paragraph';
import Layout from '../../../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../domain/HousingApi';
import { UserContext } from '../../../../lib/contexts/user-context';
import { getApplication } from '../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../lib/utils/auth';
import Custom404 from '../../../404';
import Snapshot from '../../../../components/applications/snapshot';
import Actions from '../../../../components/applications/actions';
import AssignUser from '../../../../components/applications/assign-user';

export function formatDate(date: string | undefined) {
  if (!date) return '';
  return `${new Date(date).toLocaleString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function getPersonName(application: Application | undefined) {
  if (!application?.mainApplicant?.person) return '';
  let person = application?.mainApplicant?.person;
  let name = `${person.firstName} ${person.surname}`;
  if (application.otherMembers && application.otherMembers.length > 0) {
    name += ` (+${application.otherMembers?.length})`;
  }
  return name;
}

export interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function ApplicationPage({
  user,
  data,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;

  type State = 'overview' | 'actions';
  const [state, setState] = useState<State>('overview');

  function isActive (selected: string) {
    return state == selected ? 'active' : '';
  }

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="View application">
        <HeadingOne content="View application" />
        <h2 className="lbh-heading-h2" style={{ marginTop: '0.5em', color: '#525a5b' }}>
          {getPersonName(data)}
        </h2>

        <div className="lbh-link-group">
          <button
            onClick={() => {
              setState('overview');
            }}
            className={`lbh-link lbh-link--no-visited-state ${isActive('overview')}`}
          >
            Overview
          </button>{' '}
          <button
            onClick={() => {
              setState('actions');
            }}
            className={`lbh-link lbh-link--no-visited-state ${isActive('actions')}`}
          >
            Actions
          </button>
        </div>

        {state == 'overview' && (
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <HeadingThree content="Snapshot" />
              <Snapshot data={data} />
              {data.mainApplicant && (
                <PersonalDetails
                  heading="Main Applicant"
                  applicant={data.mainApplicant}
                  applicationId={data.id}
                />
              )}
              {data.otherMembers && data.otherMembers.length > 0 && (
                <OtherMembers
                  heading="Other Members"
                  others={data.otherMembers}
                  applicationId={data.id}
                />
              )}
            </div>
            <div className="govuk-grid-column-one-third">
              <HeadingThree content="Case details" />
              <Paragraph>
                <strong>Application reference</strong>
                <br />
                {data.reference}
              </Paragraph>
              <Paragraph>
                <strong>Status</strong>
                <br />
                {data.status}
              </Paragraph>
              <Paragraph>
                <strong>Created date</strong>
                <br />
                {formatDate(data.createdAt)}
              </Paragraph>
              {data.submittedAt &&
                <Paragraph>
                  <strong>Submission date</strong>
                  <br />
                  {formatDate(data.submittedAt)}
                </Paragraph>
              }
              <AssignUser id={data.id} user={data.assignedTo} />
            </div>
          </div>
        )}
        {state == 'actions' && <Actions data={data} />}
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

  const { id } = context.params as {
    id: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { user, data } };
};
