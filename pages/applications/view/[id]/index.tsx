import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import OtherMembers from '../../../../components/admin/other-members';
import PersonalDetails from '../../../../components/admin/personal-details';
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
} from '../../../../lib/utils/googleAuth';
import Custom404 from '../../../404';
import Snapshot from '../../../../components/admin/snapshot';
import Actions from '../../../../components/admin/actions';
import AssignUser from '../../../../components/admin/assign-user';
import SensitiveData from '../../../../components/admin/sensitive-data';
import Paragraph from '../../../../components/content/paragraph';
import { formatDate } from '../../../../lib/utils/dateOfBirth';
import { getPersonName } from '../../../../lib/utils/person';
import {
  ApplicationStatus,
  lookupStatus,
} from '../../../../lib/types/application-status';

export interface PageProps {
  user: HackneyGoogleUserWithPermissions;
  data: Application;
}

export default function ApplicationPage({
  user,
  data,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;

  type AssessmentState = 'overview' | 'assessment';
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
            <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
              {getPersonName(data)}
            </h2>

            <div className="lbh-link-group lbh-link-group--spaced">
              <button
                onClick={() => {
                  setState('overview');
                }}
                className={`lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold ${isActive(
                  'overview'
                )}`}
              >
                Overview
              </button>{' '}
              {data.status !== ApplicationStatus.DRAFT && (
                <button
                  onClick={() => {
                    setState('assessment');
                  }}
                  className={`lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold ${isActive(
                    'assessment'
                  )}`}
                >
                  Assessment
                </button>
              )}
            </div>

            {state == 'overview' && (
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                  <HeadingThree content="Snapshot" />
                  <Snapshot data={data} />
                  {data.mainApplicant && (
                    <PersonalDetails
                      heading="Main applicant"
                      applicant={data.mainApplicant}
                      applicationId={data.id}
                    />
                  )}
                  {data.otherMembers && data.otherMembers.length > 0 && (
                    <OtherMembers
                      heading="Other household members"
                      others={data.otherMembers}
                      applicationId={data.id}
                    />
                  )}
                </div>
                <div className="govuk-grid-column-one-third">
                  <HeadingThree content="Case details" />
                  <ul className="lbh-list lbh-list--compressed">
                    <li>
                      <strong>Application reference</strong>
                    </li>
                    <li>{data.reference}</li>
                  </ul>
                  {data.assessment?.biddingNumber && (
                    <ul className="lbh-list lbh-list--compressed">
                      <li>
                        <strong>Bidding number</strong>
                      </li>
                      <li>{data.assessment?.biddingNumber}</li>
                    </ul>
                  )}
                  <ul className="lbh-list lbh-list--compressed">
                    <li>
                      <strong>Status</strong>
                    </li>
                    <li>{lookupStatus(data.status!)}</li>
                    <li>
                      <button
                        onClick={() => setState('assessment')}
                        className="lbh-link lbh-link--no-visited-state"
                      >
                        Change
                      </button>
                    </li>
                  </ul>

                  {data.submittedAt && (
                    <ul className="lbh-list lbh-list--compressed">
                      <li>
                        <strong>Date submitted</strong>
                      </li>
                      <li>{formatDate(data.submittedAt)}</li>
                    </ul>
                  )}
                  {data.assessment?.effectiveDate && (
                    <ul className="lbh-list lbh-list--compressed">
                      <li>
                        <strong>Application date</strong>
                      </li>
                      <li>{formatDate(data.assessment?.effectiveDate)}</li>
                      <li>
                        <button
                          onClick={() => setState('assessment')}
                          className="lbh-link lbh-link--no-visited-state"
                        >
                          Change
                        </button>
                      </li>
                    </ul>
                  )}
                  {data.assessment?.band && (
                    <ul className="lbh-list lbh-list--compressed">
                      <li>
                        <strong>Band</strong>
                      </li>
                      <li>Band {data.assessment?.band}</li>
                      <li>
                        <button
                          onClick={() => setState('assessment')}
                          className="lbh-link lbh-link--no-visited-state"
                          style={{ marginTop: '0.3em' }}
                        >
                          Change
                        </button>
                      </li>
                    </ul>
                  )}

                  <AssignUser
                    id={data.id}
                    user={user}
                    assignee={data.assignedTo}
                  />
                  <SensitiveData
                    id={data.id}
                    isSensitive={data.sensitiveData || false}
                    user={user}
                  />
                </div>
              </div>
            )}
            {state == 'assessment' && <Actions data={data} />}
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
