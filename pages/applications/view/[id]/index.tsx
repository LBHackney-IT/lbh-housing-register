import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

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
import List, { ListItem } from '../../../../components/content/list';
import Paragraph from '../../../../components/content/paragraph';
import Layout from '../../../../components/layout/staff-layout';
import { ActivityHistoryPagedResult } from '../../../../domain/ActivityHistoryApi';
import { Applicant, Application } from '../../../../domain/HousingApi';
import { UserContext } from '../../../../lib/contexts/user-context';
import {
  getApplication,
  getApplicationHistory,
} from '../../../../lib/gateways/applications-api';
import { updateApplication } from '../../../../lib/gateways/internal-api';
import {
  ApplicationStatus,
  lookupStatus,
} from '../../../../lib/types/application-status';
import { formatDate } from '../../../../lib/utils/dateOfBirth';
import {
  HackneyGoogleUserWithPermissions,
  canEditApplications,
  canViewSensitiveApplication,
  getRedirect,
  getSession,
  hasReadOnlyPermissionOnly,
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
  const router = useRouter();
  const tab = router.query.tab ?? 'overview';
  const userCanEditApplication = canEditApplications(user, data);
  const userHasReadOnlyPermissionOnly = hasReadOnlyPermissionOnly(user);

  const handleTabChange = (newValue: string) => {
    router.push({
      query: { ...router.query, tab: newValue },
    });
  };

  const handleDelete = (applicant: Applicant) => {
    const newHouseholdMembers = data.otherMembers?.filter(
      (member) => member.person?.id !== applicant.person?.id
    );

    const request: Application = {
      id: data.id,
      otherMembers: newHouseholdMembers,
    };

    updateApplication(request).then(() => {
      router.reload();
    });
  };

  return (
    <div>
      {data.id ? (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <UserContext.Provider value={{ user }}>
          <Layout
            pageName="View application"
            dataTestId="test-view-application-page"
          >
            {data.sensitiveData &&
            data.assignedTo &&
            !canViewSensitiveApplication(data.assignedTo, user) ? (
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

                <HorizontalNav spaced>
                  <HorizontalNavItem
                    handleSelectNavItem={() => handleTabChange('overview')}
                    itemName="overview"
                    isActive={tab === 'overview'}
                  >
                    Overview
                  </HorizontalNavItem>
                  <HorizontalNavItem
                    handleSelectNavItem={() => handleTabChange('history')}
                    itemName="history"
                    isActive={tab === 'history'}
                  >
                    Notes and history
                  </HorizontalNavItem>
                  {!hasReadOnlyPermissionOnly(user) &&
                  data.status !== ApplicationStatus.DRAFT &&
                  data.status !== ApplicationStatus.MANUAL_DRAFT ? (
                    <HorizontalNavItem
                      handleSelectNavItem={() => handleTabChange('assessment')}
                      itemName="assessment"
                      isActive={tab === 'assessment'}
                      dataTestId="test-applicant-assessment-section-navigation"
                    >
                      Assessment
                    </HorizontalNavItem>
                  ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <></>
                  )}
                </HorizontalNav>

                {tab === 'overview' && (
                  <>
                    {data.status === ApplicationStatus.AWAITING_REASSESSMENT &&
                    data.assessment?.reason ? (
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                          <Announcement variant="info">
                            <h3 className="lbh-page-announcement__title">
                              Review required
                            </h3>
                            <div className="lbh-page-announcement__content">
                              {data.assessment.reason ===
                              'significant-household-member-birthday' ? (
                                <>
                                  <Paragraph>
                                    This household's bedroom need has been
                                    flagged for review due to a significant
                                    birthday.
                                  </Paragraph>
                                  <h4>Changes to review:</h4>
                                  <List>
                                    <ListItem>Bedroom needs</ListItem>
                                  </List>
                                </>
                              ) : null}
                            </div>
                          </Announcement>
                        </div>
                      </div>
                    ) : null}
                    <div className="govuk-grid-row">
                      <div className="govuk-grid-column-two-thirds">
                        <HeadingThree content="Snapshot" />
                        <Snapshot data={data} />

                        {data.mainApplicant && (
                          <OverviewAnnouncements
                            applicant={data.mainApplicant}
                          />
                        )}

                        {data.mainApplicant && (
                          <PersonalDetails
                            heading="Main applicant"
                            applicant={data.mainApplicant}
                            applicationId={data.id}
                            canEdit={userCanEditApplication}
                          />
                        )}
                        {data.otherMembers && data.otherMembers.length > 0 ? (
                          <OtherMembers
                            heading="Other household members"
                            others={data.otherMembers}
                            applicationId={data.id}
                            canEdit={userCanEditApplication}
                            handleDelete={handleDelete}
                          />
                        ) : (
                          <HeadingThree content="Other household members" />
                        )}
                        {!userHasReadOnlyPermissionOnly && (
                          <ButtonLink
                            additionalCssClasses="govuk-secondary lbh-button--secondary"
                            href={`/applications/edit/${data.id}/add-household-member`}
                            dataTestId="test-add-household-member-button"
                          >
                            + Add household member
                          </ButtonLink>
                        )}
                      </div>
                      <div
                        className="govuk-grid-column-one-third"
                        data-testid="test-view-application-sidebar"
                      >
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
                          itemValue={
                            data.status ? lookupStatus(data.status) : undefined
                          }
                          buttonText={
                            !userHasReadOnlyPermissionOnly
                              ? 'Change'
                              : undefined
                          }
                          dataTestId="test-change-application-status-button"
                          onClick={() => handleTabChange('assessment')}
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
                            itemValue={formatDate(
                              data.assessment?.effectiveDate
                            )}
                            buttonText={
                              !userHasReadOnlyPermissionOnly
                                ? 'Change'
                                : undefined
                            }
                            dataTestId="test-change-application-date-button"
                            onClick={() => handleTabChange('assessment')}
                          />
                        )}

                        {data.assessment?.band && (
                          <CaseDetailsItem
                            itemHeading="Band"
                            itemValue={`Band ${data.assessment?.band}`}
                            buttonText="Change"
                            onClick={() => handleTabChange('assessment')}
                          />
                        )}

                        <AssignUser
                          id={data.id}
                          user={user}
                          assignee={data.assignedTo}
                        />
                        {!userHasReadOnlyPermissionOnly && (
                          <SensitiveData
                            id={data.id}
                            isSensitive={data.sensitiveData || false}
                            user={user}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {tab === 'history' && (
                  <ApplicationHistory
                    history={history}
                    id={data.id}
                    showDetails={!userHasReadOnlyPermissionOnly}
                  />
                )}

                {!userHasReadOnlyPermissionOnly && tab === 'assessment' && (
                  <Actions data={data} />
                )}
              </>
            )}
          </Layout>
        </UserContext.Provider>
      ) : (
        <Custom404 />
      )}
    </div>
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

  try {
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
  } catch (e) {
    console.error(e.message);
    return { props: {} };
  }
};
