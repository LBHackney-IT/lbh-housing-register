import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Layout from '../../../../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../../../../domain/HackneyGoogleUser';
import { Application } from '../../../../../domain/HousingApi';
import { UserContext } from '../../../../../lib/contexts/user-context';
import { getApplication } from '../../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../../lib/utils/auth';
import Custom404 from '../../../../404';
import CheckBoxList, {
  CheckBoxListPageProps,
} from '../../../../../components/applications/checkBoxList';
import {
  personalDetailsCheckboxList,
  immigrationStatusCheckboxList,
  livingSituationCheckboxList,
  addressHistoryCheckboxList,
  currentAccomodationCheckboxList,
  situationCheckboxList,
  employmentCheckboxList,
  incomeAndSavingsCheckboxList,
  medicalDetailsPageData,
} from '../../../../../lib/utils/checkboxListData';
import MedicalDetail, {
  MedicalDetailPageProps,
} from '../../../../../components/applications/medical-details';

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

  type State =
    | 'identity'
    | 'livingsituation'
    | 'money'
    | 'health'
    | 'checklist';
  const [state, setState] = useState<State>('identity');

  const personalDetails = personalDetailsCheckboxList(applicant);
  const immigrationStatus = immigrationStatusCheckboxList(applicant);
  const livingSituation = livingSituationCheckboxList(applicant);
  const addressHistory = addressHistoryCheckboxList(applicant);
  const currentAccomodation = currentAccomodationCheckboxList(applicant);
  const situation = situationCheckboxList(applicant);
  const employment = employmentCheckboxList(applicant);
  const incomeAndSavings = incomeAndSavingsCheckboxList(applicant);
  const medicalDetails = medicalDetailsPageData(applicant);

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
        
        <button
          onClick={() => {
            setState('identity');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Identity
        </button>{' '}
        <button
          onClick={() => {
            setState('livingsituation');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Living Situation
        </button>{' '}
        <button
          onClick={() => {
            setState('money');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Money
        </button>{' '}
        <button
          onClick={() => {
            setState('health');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Health
        </button>{' '}
        {/* <button
          onClick={() => {
            setState('checklist');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Checklist
        </button> */}
        {state == 'identity' && (
          <>
            <CheckBoxList {...(personalDetails as CheckBoxListPageProps)} />
            <CheckBoxList {...(immigrationStatus as CheckBoxListPageProps)} />
          </>
        )}
        {state == 'livingsituation' && (
          <>
            <CheckBoxList {...(livingSituation as CheckBoxListPageProps)} />
            <CheckBoxList {...(addressHistory as CheckBoxListPageProps)} />
            <CheckBoxList {...(currentAccomodation as CheckBoxListPageProps)} />
            <CheckBoxList {...(situation as CheckBoxListPageProps)} />
          </>
        )}
        {state == 'money' && (
          <>
            <CheckBoxList {...(employment as CheckBoxListPageProps)} />
            <CheckBoxList {...(incomeAndSavings as CheckBoxListPageProps)} />
          </>
        )}
        {state == 'health' && (
          <MedicalDetail {...(medicalDetails as MedicalDetailPageProps)} />
        )}
        {state == 'checklist' && <h3>checklist</h3>}
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
