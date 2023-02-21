import { GetServerSideProps } from 'next';
import React, { useState, SyntheticEvent } from 'react';
import Layout from '../../../../../components/layout/staff-layout';
import {Application, ContactInformation} from '../../../../../domain/HousingApi';
import { UserContext } from '../../../../../lib/contexts/user-context';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import {
  canViewSensitiveApplication,
  getRedirect,
  getSession,
  HackneyGoogleUserWithPermissions,
} from '../../../../../lib/utils/googleAuth';
import Custom404 from '../../../../404';
import CheckBoxList, {
  CheckBoxListPageProps,
} from '../../../../../components/admin/checkbox-list';
import {
  personalDetailsCheckboxList,
  immigrationStatusCheckboxList,
  residentialStatusCheckboxList,
  addressHistoryCheckboxList,
  currentAccomodationCheckboxList,
  situationCheckboxList,
  employmentCheckboxList,
  incomeAndSavingsCheckboxList,
} from '../../../../../lib/utils/checkboxListData';
import MedicalDetail from '../../../../../components/admin/medical-details';
import { HeadingOne } from '../../../../../components/content/headings';
import Button from '../../../../../components/button';
import Paragraph from '../../../../../components/content/paragraph';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../../../../components/admin/HorizontalNav';

interface PageProps {
  user: HackneyGoogleUserWithPermissions;
  data: Application;
  person: string;
  evidenceLink: string;
}

export default function ApplicationPersonPage({
  user,
  data,
  person,
  evidenceLink,
}: PageProps): JSX.Element {
  let isMainApplicant = data.mainApplicant?.person?.id === person;
  let applicant = isMainApplicant
    ? data.mainApplicant
    : data.otherMembers?.find((x) => x.person?.id === person);

  const index = data.otherMembers?.findIndex((x) => {
    return x.person?.id === person;
  });

  type ActiveNavItem =
    | 'identity'
    | 'livingsituation'
    | 'money'
    | 'health'
    | 'checklist';

  const [activeNavItem, setActiveNavItem] = useState<ActiveNavItem>('identity');

  const handleSelectNavItem = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;
    setActiveNavItem(name as ActiveNavItem);
  };

  const personalDetails = personalDetailsCheckboxList(applicant);
  const immigrationStatus = immigrationStatusCheckboxList(applicant);
  const residentialStatus = residentialStatusCheckboxList(applicant);
  const addressHistory = addressHistoryCheckboxList(applicant);
  const currentAccomodation = currentAccomodationCheckboxList(applicant);
  const situation = situationCheckboxList(applicant);
  const employment = employmentCheckboxList(applicant);
  const incomeAndSavings = incomeAndSavingsCheckboxList(applicant);

  return (
    <>
      {data.id ? (
        <UserContext.Provider value={{ user }}>
          <Layout>
            {data.sensitiveData &&
            !canViewSensitiveApplication(data.assignedTo!, user) ? (
              <>
                <h2>Access denied</h2>
                <Paragraph>You are unable to view this application.</Paragraph>
              </>
            ) : (
              <>
                <div className="govuk-grid-row">
                  <div className="govuk-grid-column-two-thirds">
                    <HeadingOne
                      content={
                        isMainApplicant
                          ? 'Review main applicant'
                          : 'Review household member'
                      }
                    />
                    <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
                      {applicant?.person?.firstName}{' '}
                      {applicant?.person?.surname}
                    </h2>
                  </div>
                  <div
                    className="govuk-grid-column-one-third"
                    style={{ textAlign: 'right' }}
                  >
                    <a href={evidenceLink+
                      "/deeplink?searchTerm="+
                      applicant?.person?.firstName+' '+
                      applicant?.person?.surname+
                      "&groupId="+data.id+
                      "&name"+applicant?.person?.firstName+' '+
                      applicant?.person?.surname+
                      "&phone="+applicant?.contactInformation?.phoneNumber+
                      "&email="+applicant?.contactInformation?.emailAddress}
                       target="_blank">
                      <Button>View Documents</Button>
                    </a>
                  </div>
                </div>

                <HorizontalNav spaced={true}>
                  <HorizontalNavItem
                    handleSelectNavItem={handleSelectNavItem}
                    itemName="identity"
                    isActive={activeNavItem === 'identity'}
                  >
                    Identity
                  </HorizontalNavItem>
                  <HorizontalNavItem
                    handleSelectNavItem={handleSelectNavItem}
                    itemName="livingsituation"
                    isActive={activeNavItem === 'livingsituation'}
                  >
                    Living Situation
                  </HorizontalNavItem>
                  <HorizontalNavItem
                    handleSelectNavItem={handleSelectNavItem}
                    itemName="money"
                    isActive={activeNavItem === 'money'}
                  >
                    Money
                  </HorizontalNavItem>
                  <HorizontalNavItem
                    handleSelectNavItem={handleSelectNavItem}
                    itemName="health"
                    isActive={activeNavItem === 'health'}
                  >
                    Health
                  </HorizontalNavItem>
                  {/*
                  <HorizontalNavItem
                    handleSelectNavItem={handleSelectNavItem}
                    itemName="checklist"
                    isActive={activeNavItem === 'checklist'}
                  >
                    Checklist
                  </HorizontalNavItem>
                  */}
                </HorizontalNav>

                {activeNavItem === 'identity' && (
                  <>
                    <CheckBoxList
                      {...(personalDetails as CheckBoxListPageProps)}
                    />
                    <CheckBoxList
                      {...(immigrationStatus as CheckBoxListPageProps)}
                    />
                  </>
                )}
                {activeNavItem === 'livingsituation' && (
                  <>
                    <CheckBoxList
                      {...(residentialStatus as CheckBoxListPageProps)}
                    />
                    <CheckBoxList
                      {...(addressHistory as CheckBoxListPageProps)}
                    />
                    <CheckBoxList
                      {...(currentAccomodation as CheckBoxListPageProps)}
                    />
                    <CheckBoxList {...(situation as CheckBoxListPageProps)} />
                  </>
                )}
                {activeNavItem === 'money' && (
                  <>
                    <CheckBoxList {...(employment as CheckBoxListPageProps)} />
                    <CheckBoxList
                      {...(incomeAndSavings as CheckBoxListPageProps)}
                    />
                  </>
                )}
                {activeNavItem === 'health' && (
                  <MedicalDetail data={data} memberIndex={index ?? -1} />
                )}
                {activeNavItem === 'checklist' && <h3>checklist</h3>}
              </>
            )}
          </Layout>
        </UserContext.Provider>
      ) : (
        <Custom404 />
      )}
    </>
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
