import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import OtherMembers from '../../../../components/applications/other-members';
import PersonalDetails from '../../../../components/applications/personal-details';
import {
  HeadingOne,
  HeadingThree,
} from '../../../../components/content/headings';
import Layout from '../../../../components/layout/staff-layout';
import { Application } from '../../../../domain/HousingApi';
import { UserContext } from '../../../../lib/contexts/user-context';
import { getApplication } from '../../../../lib/gateways/applications-api';
import {
  canViewSensitiveApplication,
  getRedirect,
  getSession,
  HackneyGoogleUserWithPermissions,
} from '../../../../lib/utils/auth';
import Custom404 from '../../../404';
import Snapshot from '../../../../components/applications/snapshot';
import Actions from '../../../../components/applications/actions';
import AssignUser from '../../../../components/applications/assign-user';
import SensitiveData from '../../../../components/applications/sensitive-data';
import Paragraph from '../../../../components/content/paragraph';
import { formatDate } from '../../../../components/applications/application-table';

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
  user: HackneyGoogleUserWithPermissions;
  data: Application;
}

export default function ApplicationPage({
  user,
  data,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;

  type AssessmentState = 'overview' | 'actions';
  const [state, setState] = useState<AssessmentState>('overview');

  function isActive(selected: string) {
    return state == selected ? 'active' : '';
  }

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="View application">
        {data.sensitiveData &&
        !canViewSensitiveApplication(data.assignedTo!, user) ? (
          <>
            <h2>Access denied</h2>
            <Paragraph>You are unable to view this application.</Paragraph>
          </>
        ) : (
          <>
            <HeadingOne content="View application" />
            <h2
              className="lbh-heading-h2"
              style={{ marginTop: '0.5em', color: '#525a5b' }}
            >
              {getPersonName(data)}
            </h2>

            <div className="lbh-link-group">
              <button
                onClick={() => {
                  setState('overview');
                }}
                className={`lbh-link lbh-link--no-visited-state ${isActive(
                  'overview'
                )}`}
              >
                Overview
              </button>{' '}
              <button
                onClick={() => {
                  setState('actions');
                }}
                className={`lbh-link lbh-link--no-visited-state ${isActive(
                  'actions'
                )}`}
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
                  {data.assessment?.biddingNumber && (
                    <Paragraph>
                      <strong>Bidding number</strong>
                      <br />
                      {data.assessment?.biddingNumber}
                    </Paragraph>
                  )}
                  <Paragraph>
                    <strong>Status</strong>
                    <br />
                    {data.status}
                    <button
                      onClick={() => setState('actions')}
                      className="lbh-link lbh-link--no-visited-state"
                      style={{ marginTop: '0', marginLeft: '0.5em' }}
                    >
                      Change
                    </button>
                  </Paragraph>
                  {data.submittedAt && (
                    <Paragraph>
                      <strong>Date submitted</strong>
                      <br />
                      {formatDate(data.submittedAt)}
                    </Paragraph>
                  )}
                  {data.assessment?.effectiveDate && (
                    <Paragraph>
                      <strong>Application date</strong>
                      <br />
                      {formatDate(data.assessment?.effectiveDate)}
                      <button
                        onClick={() => setState('actions')}
                        className="lbh-link lbh-link--no-visited-state"
                        style={{ marginTop: '0', marginLeft: '0.5em' }}
                      >
                        Change
                      </button>
                    </Paragraph>
                  )}
                  {data.assessment?.band && (
                    <Paragraph>
                      <strong>Band</strong>
                      <br />
                      Band {data.assessment?.band}
                      <button
                        onClick={() => setState('actions')}
                        className="lbh-link lbh-link--no-visited-state"
                        style={{ marginTop: '0', marginLeft: '0.5em' }}
                      >
                        Change
                      </button>
                    </Paragraph>
                  )}

                  {user.hasAdminPermissions ||
                    (user.hasManagerPermissions && (
                      <>
                        <AssignUser id={data.id} user={data.assignedTo} />
                        <SensitiveData
                          id={data.id}
                          isSensitive={data.sensitiveData || false}
                        />
                      </>
                    ))}
                </div>
              </div>
            )}
            {state == 'actions' && <Actions data={data} />}
          </>
        )}
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
