import { useMemo } from 'react';
import Layout from '../../../components/layout/resident-layout';
import {
  selectApplicant,
  getQuestionValue,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import Custom404 from '../../404';
import DeleteLink from '../../../components/delete-link';
import PersonalDetailsSummary from '../../../components/summary/PersonalDetails';
import React from 'react';
import { AddressHistorySummary } from '../../../components/summary/AddressHistory';
import { CurrentAccommodationSummary } from '../../../components/summary/CurrentAccommodation';
import { EmploymentSummary } from '../../../components/summary/Employment';
import { ImmigrationStatusSummary } from '../../../components/summary/ImmigrationStatus';
import { IncomeSavingsSummary } from '../../../components/summary/IncomeSavings';
import { MedicalNeedsSummary } from '../../../components/summary/MedicalNeeds';
import { ResidentialStatusSummary } from '../../../components/summary/ResidentialStatus';
import { YourSituationSummary } from '../../../components/summary/YourSituation';
import { Applicant } from '../../../domain/HousingApi';
import { checkEligible } from '../../../lib/utils/form';
import Button from '../../../components/button';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { FormID } from '../../../lib/utils/form-data';

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const isMainApplicant = currentResident == mainResident;

  if (!currentResident) {
    return <Custom404 />;
  }

  const baseHref = `/apply/${currentResident.person?.id}`;
  const returnHref = '/apply/overview';

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const eligibilityMap = useMemo(
    () =>
      new Map(
        applicants.map((applicant) => [
          applicant,
          checkEligible(applicant, isMainApplicant)[0],
        ])
      ),
    [applicants]
  );

  const onConfirmData = () => {
    let isEligible = true;
    applicants.map((applicant, index) => {
      if (!eligibilityMap.get(applicant)) {
        isEligible = false;
      }
    });

    if (!isEligible) {
      router.push('/apply/not-eligible');
    } else {
      router.push('/apply/overview');
    }
  };

  const onDelete = () => {
    // TODO: delete applicant
    router.push(returnHref);
  };

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: currentResident.person?.firstName || '',
    },
  ];

  const pesonalDetailsCompleted = getQuestionValue(
    currentResident.questions,
    'personal-details',
    'sectionCompleted',
    false
  );

  const immigrationStatusCompleted = getQuestionValue(
    currentResident.questions,
    'immigration-status',
    'sectionCompleted',
    false
  );

  const residentialStatusCompleted = getQuestionValue(
    currentResident.questions,
    'residential-status',
    'sectionCompleted',
    false
  );

  const addressHistoryCompleted = getQuestionValue(
    currentResident.questions,
    'address-history',
    'sectionCompleted',
    false
  );

  const currentAccommodationCompleted = getQuestionValue(
    currentResident.questions,
    'current-accommodation',
    'sectionCompleted',
    false
  );

  const yourSituationCompleted = getQuestionValue(
    currentResident.questions,
    'your-situation',
    'sectionCompleted',
    false
  );

  const incomeSavingsCompleted = getQuestionValue(
    currentResident.questions,
    'income-savings',
    'sectionCompleted',
    false
  );

  const employmentCompleted = getQuestionValue(
    currentResident.questions,
    'employment',
    'sectionCompleted',
    false
  );

  const medicalNeedsCompleted = getQuestionValue(
    currentResident.questions,
    'medical-needs',
    'sectionCompleted',
    false
  );

  return (
    <Layout pageName="Application summary" breadcrumbs={breadcrumbs}>
      <h1 className="lbh-heading-h1">
        <span className="govuk-hint lbh-hint">Check answers for:</span>
        {currentResident.person?.firstName} {currentResident.person?.surname}
      </h1>
      {pesonalDetailsCompleted && (
        <PersonalDetailsSummary currentResident={currentResident} />
      )}

      {isMainApplicant && (
        <>
          {immigrationStatusCompleted && (
            <ImmigrationStatusSummary currentResident={currentResident} />
          )}
          {residentialStatusCompleted && (
            <ResidentialStatusSummary currentResident={currentResident} />
          )}
        </>
      )}
      {addressHistoryCompleted && (
        <AddressHistorySummary currentResident={currentResident} />
      )}

      {isMainApplicant && (
        <>
          {currentAccommodationCompleted && (
            <CurrentAccommodationSummary currentResident={currentResident} />
          )}
          {yourSituationCompleted && (
            <YourSituationSummary currentResident={currentResident} />
          )}
        </>
      )}

      {isOver18(currentResident) && (
        <>
          {incomeSavingsCompleted && (
            <IncomeSavingsSummary currentResident={currentResident} />
          )}
          {employmentCompleted && (
            <EmploymentSummary currentResident={currentResident} />
          )}
        </>
      )}
      {medicalNeedsCompleted && (
        <MedicalNeedsSummary currentResident={currentResident} />
      )}

      <Button onClick={onConfirmData}>I confirm this is correct</Button>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  );
};

export default UserSummary;
