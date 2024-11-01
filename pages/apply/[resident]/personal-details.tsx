import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ApplicantStep from '../../../components/application/ApplicantStep';
import withApplication from '../../../lib/hoc/withApplication';
import {
  applicantHasId,
  selectApplicant,
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import AddPersonForm from '../../../components/application/add-person-form';
import { Applicant } from '../../../domain/HousingApi';
import useApiCallSelectorStatus from '../../../lib/hooks/useApiCallStatus';
import {
  ApiCallStatusCode,
  selectSaveApplicationStatus,
} from 'lib/store/apiCallsStatus';
import { scrollToError } from 'lib/utils/scroll';
import Loading from 'components/loading';
import ErrorSummary from 'components/errors/error-summary';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };
  const dispatch = useAppDispatch();

  const [isOver16State, setIsOver16State] = useState(true);

  const applicant = useAppSelector(selectApplicant(resident)) as Applicant;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  const isMainApplicant = applicant == mainResident;

  useApiCallSelectorStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSubmitted,
    setUserError,
    scrollToError,
    pathToPush: `/apply/${resident}`,
  });

  const onSubmit = ({
    title,
    firstName,
    surname,
    gender,
    genderDescription,
    relationshipType,
    dateOfBirth,
    nationalInsuranceNumber,
    phoneNumber,
    emailAddress,
    ...values
  }: FormikValues) => {
    if (!isOver16State) {
      nationalInsuranceNumber = '';
    }

    if (!isMainApplicant) {
      phoneNumber = '';
      emailAddress = '';
    }

    setHasSubmitted(true);

    dispatch(
      updateApplicant({
        person: {
          id: applicant.person?.id || '',
          title,
          firstName,
          surname,
          dateOfBirth,
          gender,
          genderDescription,
          relationshipType,
          nationalInsuranceNumber,
        },
        contactInformation: {
          phoneNumber,
          emailAddress,
        },
      })
    );
    dispatch(
      updateWithFormValues({
        formID: FormID.PERSONAL_DETAILS,
        personID: applicant.person!.id!,
        values,
        markAsComplete: true,
      })
    );
  };

  return (
    <>
      {applicantHasId(applicant) ? (
        <ApplicantStep
          applicant={applicant}
          stepName="Personal details"
          formID={FormID.PERSONAL_DETAILS}
          dataTestId="test-apply-resident-personal-details-step"
        >
          {userError && (
            <ErrorSummary dataTestId="test-apply-resident-personal-details-step-error-summary">
              {userError}
            </ErrorSummary>
          )}
          {saveApplicationStatus?.callStatus === ApiCallStatusCode.PENDING ? (
            <Loading text="Saving..." />
          ) : (
            <AddPersonForm
              applicant={applicant}
              onSubmit={onSubmit}
              isMainApplicant={isMainApplicant}
              buttonText="Save and continue"
              isOver16={isOver16State}
              setIsOver16State={setIsOver16State}
            />
          )}
        </ApplicantStep>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

export default withApplication(ApplicationStep);
