import { useMemo } from 'react';
import Layout from '../../../components/layout/resident-layout';
import { selectApplicant } from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import Custom404 from '../../404';
import { ButtonLink } from '../../../components/button';
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
import { removeTypeDuplicates } from '@babel/types';

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
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
        applicants.map((applicant) => [applicant, checkEligible(applicant)[0]])
      ),
    [applicants]
  );

  const onConfirmData = () => {
    applicants.map((applicant, index) => {
      const isEligible = eligibilityMap.get(applicant);

      if (!isEligible) {
        router.push('/apply/not-eligible');
      }
    });

    router.push('/apply/overview');
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

  return (
    <Layout pageName="Application summary" breadcrumbs={breadcrumbs}>
      <h1 className="lbh-heading-h1">
        <span className="govuk-hint lbh-hint">Check answers for:</span>
        {currentResident.person?.firstName} {currentResident.person?.surname}
      </h1>

      <PersonalDetailsSummary currentResident={currentResident} />
      <ImmigrationStatusSummary currentResident={currentResident} />
      <ResidentialStatusSummary currentResident={currentResident} />
      <AddressHistorySummary currentResident={currentResident} />
      <CurrentAccommodationSummary currentResident={currentResident} />
      <YourSituationSummary currentResident={currentResident} />
      <IncomeSavingsSummary currentResident={currentResident} />
      <EmploymentSummary currentResident={currentResident} />
      <MedicalNeedsSummary currentResident={currentResident} />

      <ButtonLink href="/apply/overview">I confirm this is correct</ButtonLink>
      <Button onClick={onConfirmData}>I confirm this is correct Button</Button>
      <DeleteLink content="Delete this information" onDelete={onDelete} />
    </Layout>
  );
};

export default UserSummary;
