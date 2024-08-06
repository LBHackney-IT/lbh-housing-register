import React, { useState } from 'react';

import { FormikValues } from 'formik';
import { useRouter } from 'next/router';

import AddPersonForm from '../../../components/application/add-person-form';
import ApplicantStep from '../../../components/application/ApplicantStep';
import { Applicant } from '../../../domain/HousingApi';
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

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };
  const dispatch = useAppDispatch();

  const [isOver16State, setIsOver16State] = useState(true);

  const applicant = useAppSelector(selectApplicant(resident)) as Applicant;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const isMainApplicant = applicant == mainResident;

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

    router.push(`/apply/${resident}`);
  };

  return (
    <>
      {applicantHasId(applicant) ? (
        <ApplicantStep
          applicant={applicant}
          stepName="Personal details"
          formID={FormID.PERSONAL_DETAILS}
        >
          <AddPersonForm
            applicant={applicant}
            onSubmit={onSubmit}
            isMainApplicant={isMainApplicant}
            buttonText="Save and continue"
            isOver16={isOver16State}
            setIsOver16State={setIsOver16State}
          />
        </ApplicantStep>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

export default withApplication(ApplicationStep);
