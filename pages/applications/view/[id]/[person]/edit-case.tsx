import { GetServerSideProps } from 'next';
import React, { useState, SyntheticEvent } from 'react';
import Layout from '../../../../../components/layout/staff-layout';
import { Application } from '../../../../../domain/HousingApi';
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

export default function EditCasePage({
  user,
  data,
  person,
  evidenceLink,
}: PageProps): JSX.Element {
  if (!data.id) return <Custom404 />;

  console.log(data);

  // let isMainApplicant = data.mainApplicant?.person?.id === person;
  // let applicant = isMainApplicant
  //   ? data.mainApplicant
  //   : data.otherMembers?.find((x) => x.person?.id === person);

  // const index = data.otherMembers?.findIndex((x) => {
  //   return x.person?.id === person;
  // });

  // type State =
  //   | 'identity'
  //   | 'livingsituation'
  //   | 'money'
  //   | 'health'
  //   | 'checklist';
  // const [state, setState] = useState<State>('identity');

  // function isActive(selected: string) {
  //   return state == selected ? 'active' : '';
  // }

  // const [activeNavItem, setActiveNavItem] = useState('identity');

  // const handleClick = async (event: SyntheticEvent) => {
  //   event.preventDefault();
  //   const { name } = event.target as HTMLButtonElement;
  //   setActiveNavItem(name);
  // };

  // const personalDetails = personalDetailsCheckboxList(applicant);
  // const immigrationStatus = immigrationStatusCheckboxList(applicant);
  // const residentialStatus = residentialStatusCheckboxList(applicant);
  // const addressHistory = addressHistoryCheckboxList(applicant);
  // const currentAccomodation = currentAccomodationCheckboxList(applicant);
  // const situation = situationCheckboxList(applicant);
  // const employment = employmentCheckboxList(applicant);
  // const incomeAndSavings = incomeAndSavingsCheckboxList(applicant);

  return <Layout>Edit Case</Layout>;
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
