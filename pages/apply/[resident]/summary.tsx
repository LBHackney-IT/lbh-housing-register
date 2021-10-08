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
import { checkEligible } from '../../../lib/utils/form';
import Button from '../../../components/button';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { FormID } from '../../../lib/utils/form-data';
import withApplication from '../../../lib/hoc/withApplication';
import { removeApplicant } from '../../../lib/store/otherMembers';
import { useDispatch } from 'react-redux';
import {
  disqualifyApplication,
  sendDisqualifyEmail,
} from '../../../lib/store/application';

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const isMainApplicant = currentResident == mainResident;

  if (!currentResident || !mainResident) {
    return <Custom404 />;
  }

  const application = useAppSelector((store) => store.application);

  const baseHref = `/apply/${currentResident.person?.id}`;
  const returnHref = '/apply/overview';

  const onConfirmData = () => {
    const [isEligible] = checkEligible(application);
    if (!isEligible) {
      dispatch(sendDisqualifyEmail(application));
      dispatch(disqualifyApplication(application.id!));
      router.push('/apply/not-eligible');
    } else {
      router.push('/apply/overview');
    }
  };

  const onDelete = () => {
    dispatch(removeApplicant(currentResident.person.id));
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

  function isSectionComplete(sectionName: FormID) {
    return getQuestionValue(
      currentResident?.questions,
      sectionName,
      'sectionCompleted',
      false
    );
  }

  const pesonalDetailsCompleted = isSectionComplete(FormID.PERSONAL_DETAILS);
  const immigrationStatusCompleted = isSectionComplete(
    FormID.IMMIGRATION_STATUS
  );
  const residentialStatusCompleted = isSectionComplete(
    FormID.RESIDENTIAL_STATUS
  );
  const addressHistoryCompleted = isSectionComplete(FormID.ADDRESS_HISTORY);
  const currentAccommodationCompleted = isSectionComplete(
    FormID.CURRENT_ACCOMMODATION
  );
  const yourSituationCompleted = isSectionComplete(FormID.YOUR_SITUATION);
  const incomeSavingsCompleted = isSectionComplete(FormID.INCOME_SAVINGS);
  const employmentCompleted = isSectionComplete(FormID.EMPLOYMENT);
  const medicalNeedsCompleted = isSectionComplete(FormID.MEDICAL_NEEDS);

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
      {currentResident !== mainResident && (
        <DeleteLink
          content="Delete this information"
          details="This information will be permanently deleted."
          onDelete={onDelete}
        />
      )}
    </Layout>
  );
};

export default withApplication(UserSummary);
