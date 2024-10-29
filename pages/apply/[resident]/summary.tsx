import Layout from '../../../components/layout/resident-layout';
import {
  ApplicantWithPersonID,
  selectApplicant,
  getQuestionValue,
} from '../../../lib/store/applicant';
import { useAppSelector, useAppDispatch } from '../../../lib/store/hooks';
import { useRouter } from 'next/router';
import Custom404 from '../../404';
import DeleteLink from '../../../components/delete-link';
import PersonalDetailsSummary from '../../../components/summary/PersonalDetails';
import React, { useState } from 'react';
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
import { getDisqualificationReasonOption } from '../../../lib/utils/disqualificationReasonOptions';
import {
  disqualifyApplication,
  sendDisqualifyEmail,
} from '../../../lib/store/application';
import { Applicant } from '../../../domain/HousingApi';
import { scrollToError } from 'lib/utils/scroll';
import Loading from 'components/loading';
import ErrorSummary from 'components/errors/error-summary';
import { selectSaveApplicationStatus } from 'lib/store/apiCallsStatus';
import useApiCallStatus from 'lib/hooks/useApiCallStatus';

const UserSummary = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(
    selectApplicant(resident)
  ) as ApplicantWithPersonID;
  const mainResident = useAppSelector(
    (s) => s.application.mainApplicant
  ) as Applicant;
  const isMainApplicant = currentResident == mainResident;

  const application = useAppSelector((store) => store.application);

  const [userError, setUserError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [
    hasDeletedHouseholdMember,
    setHasDeletedHouseholdMember,
  ] = useState<boolean>(false);

  const returnHref = '/apply/overview';

  useApiCallStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasDeletedHouseholdMember,
    setUserError,
    scrollToError,
    pathToPush: returnHref,
  });

  if (isSaving) {
    return (
      <Layout pageName="Application summary" pageLoadsApplication={false}>
        <Loading text="Saving..." />
      </Layout>
    );
  }

  if (!currentResident || !mainResident) {
    return <Custom404 />;
  }

  const onConfirmData = async () => {
    const [isEligible, reasons] = checkEligible(application);
    if (!isEligible) {
      const reasonStrings = reasons.map((reason) =>
        getDisqualificationReasonOption(reason)
      );
      const reason = reasonStrings.join(',');

      try {
        setIsSaving(true);
        await dispatch(sendDisqualifyEmail({ application, reason }));
        await dispatch(disqualifyApplication(application.id!)).unwrap();
        router.push('/apply/not-eligible');
      } catch (error) {
        setUserError('Unable to update application');
        scrollToError();
      } finally {
        setIsSaving(false);
      }
    } else {
      router.push('/apply/overview');
    }
  };

  const onDelete = () => {
    setHasDeletedHouseholdMember(true);
    setIsSaving(true);
    dispatch(removeApplicant(currentResident.person!.id!));
  };

  const baseHref = `/apply/${currentResident.person?.id}`;

  const breadcrumbs = [
    {
      id: 'apply-overview',
      href: returnHref,
      name: 'Application',
    },
    {
      id: 'apply-resident',
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
    <Layout
      pageName="Application summary"
      breadcrumbs={breadcrumbs}
      dataTestId="test-apply-resident-summary-page"
    >
      <h1 className="lbh-heading-h1">
        <span className="govuk-hint lbh-hint">Check answers for:</span>
        {currentResident.person?.firstName} {currentResident.person?.surname}
      </h1>
      {userError && (
        <ErrorSummary dataTestId="test-agree-terms-error-summary">
          {userError}
        </ErrorSummary>
      )}
      {isSaving ? (
        <Loading text="Saving..." />
      ) : (
        <>
          {pesonalDetailsCompleted && (
            <PersonalDetailsSummary currentResident={currentResident} />
          )}

          {immigrationStatusCompleted && (
            <ImmigrationStatusSummary currentResident={currentResident} />
          )}

          {isMainApplicant && (
            <>
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
                <CurrentAccommodationSummary
                  currentResident={currentResident}
                />
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

          <Button
            onClick={onConfirmData}
            dataTestId="test-apply-resident-summary-confirm-details-button"
          >
            I confirm this is correct
          </Button>
          {currentResident !== mainResident && (
            <DeleteLink
              content="Delete this information"
              details="This information will be permanently deleted."
              onDelete={onDelete}
              mainButtonTestId="test-apply-resident-summary-delete-this-information-button"
              dialogConfirmButtonTestId="test-apply-resident-summary-yes-delete-this-information-button"
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default withApplication(UserSummary);
