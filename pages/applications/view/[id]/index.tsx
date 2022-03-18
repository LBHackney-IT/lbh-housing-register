import { GetServerSideProps } from 'next';
import React, { SyntheticEvent, useState } from 'react';
import Actions from '../../../../components/admin/actions';
import ApplicationHistory from '../../../../components/admin/ApplicationHistory';
import AssignUser from '../../../../components/admin/assign-user';
import CaseDetailsItem from '../../../../components/admin/CaseDetailsItem';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../../../components/admin/HorizontalNav';
import OtherMembers from '../../../../components/admin/other-members';
import OverviewAnnouncements from '../../../../components/admin/OverviewAnnouncements';
import PersonalDetails from '../../../../components/admin/personal-details';
import SensitiveData from '../../../../components/admin/sensitive-data';
import Snapshot from '../../../../components/admin/snapshot';
import Announcement from '../../../../components/announcement';
import { ButtonLink } from '../../../../components/button';
import {
  HeadingOne,
  HeadingThree,
} from '../../../../components/content/headings';
import Paragraph from '../../../../components/content/paragraph';
import Layout from '../../../../components/layout/staff-layout';
import { ActivityHistoryPagedResult } from '../../../../domain/ActivityHistoryApi';
import { Application } from '../../../../domain/HousingApi';
import { UserContext } from '../../../../lib/contexts/user-context';
import {
  getApplication,
  getApplicationHistory,
} from '../../../../lib/gateways/applications-api';
import {
  ApplicationStatus,
  lookupStatus,
} from '../../../../lib/types/application-status';
import { formatDate } from '../../../../lib/utils/dateOfBirth';
import {
  canViewSensitiveApplication,
  getRedirect,
  getSession,
  HackneyGoogleUserWithPermissions,
} from '../../../../lib/utils/googleAuth';
import { getPersonName } from '../../../../lib/utils/person';
import Custom404 from '../../../404';

export interface PageProps {
  user: HackneyGoogleUserWithPermissions;
  data: Application;
  history: ActivityHistoryPagedResult;
}

export default function ApplicationPage({
  user,
  data,
  history,
}: PageProps): JSX.Element | null {
  if (!data.id) return <Custom404 />;

  // Can edit application if:
  // - it has a status of manual draft
  // - it has a status of incomplete and current user is assigned to it
  const canEditApplication =
    data.status === ApplicationStatus.MANUAL_DRAFT ||
    (data.status === 'New' && data.assignedTo === user.email);

  const [activeNavItem, setActiveNavItem] = useState('overview');

  const handleClick = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;
    setActiveNavItem(name);
  };

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
            {data.importedFromLegacyDatabase ? (
              <Announcement variant="info">
                <h3 className="lbh-page-announcement__title">
                  Legacy application
                </h3>
                <div className="lbh-page-announcement__content">
                  This application was imported from a legacy system. Only
                  limited information is available for legacy applications.
                </div>
              </Announcement>
            ) : null}

            <HeadingOne content="View application" />
            <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
              {getPersonName(data)}
            </h2>

            <HorizontalNav spaced={true}>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="overview"
                isActive={activeNavItem === 'overview'}
              >
                Overview
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="history"
                isActive={activeNavItem === 'history'}
              >
                Notes and history
              </HorizontalNavItem>
              {data.status !== ApplicationStatus.DRAFT &&
              data.status !== ApplicationStatus.MANUAL_DRAFT ? (
                <HorizontalNavItem
                  handleClick={handleClick}
                  itemName="assessment"
                  isActive={activeNavItem === 'assessment'}
                >
                  Assessment
                </HorizontalNavItem>
              ) : (
                <></>
              )}
            </HorizontalNav>

            {activeNavItem === 'overview' && (
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                  <HeadingThree content="Snapshot" />
                  <Snapshot data={data} />

                  {data.mainApplicant && (
                    <OverviewAnnouncements applicant={data.mainApplicant} />
                  )}

                  {data.mainApplicant && (
                    <PersonalDetails
                      heading="Main applicant"
                      applicant={data.mainApplicant}
                      applicationId={data.id}
                      canEdit={canEditApplication}
                    />
                  )}
                  {data.otherMembers && data.otherMembers.length > 0 ? (
                    <OtherMembers
                      heading="Other household members"
                      others={data.otherMembers}
                      applicationId={data.id}
                      canEdit={canEditApplication}
                    />
                  ) : (
                    <HeadingThree content="Other household members" />
                  )}
                  {canEditApplication && (
                    <ButtonLink
                      additionalCssClasses="govuk-secondary lbh-button--secondary"
                      href={`/applications/edit/${data.id}/add-household-member`}
                    >
                      + Add household member
                    </ButtonLink>
                  )}
                </div>
                <div className="govuk-grid-column-one-third">
                  <HeadingThree content="Case details" />

                  <CaseDetailsItem
                    itemHeading="Application reference"
                    itemValue={data.reference}
                  />

                  {data.assessment?.biddingNumber && (
                    <CaseDetailsItem
                      itemHeading="Bidding number"
                      itemValue={data.assessment?.biddingNumber}
                    />
                  )}

                  <CaseDetailsItem
                    itemHeading="Status"
                    itemValue={lookupStatus(data.status!)}
                    buttonText="Change"
                    onClick={() => setActiveNavItem('assessment')}
                  />

                  {data.submittedAt && (
                    <CaseDetailsItem
                      itemHeading="Date submitted"
                      itemValue={formatDate(data.submittedAt)}
                    />
                  )}

                  {data.assessment?.effectiveDate && (
                    <CaseDetailsItem
                      itemHeading="Application date"
                      itemValue={formatDate(data.assessment?.effectiveDate)}
                      buttonText="Change"
                      onClick={() => setActiveNavItem('assessment')}
                    />
                  )}

                  {data.assessment?.band && (
                    <CaseDetailsItem
                      itemHeading="Band"
                      itemValue={`Band ${data.assessment?.band}`}
                      buttonText="Change"
                      onClick={() => setActiveNavItem('assessment')}
                    />
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

            {activeNavItem === 'history' && (
              <ApplicationHistory
                setActiveNavItem={setActiveNavItem}
                history={history}
                id={data.id}
              />
            )}

            {activeNavItem === 'assessment' && <Actions data={data} />}
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

  const history = await getApplicationHistory(id, context.req);

  return { props: { user, data, history } };
};
