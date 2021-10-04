import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ApplicantStep from '../../../components/application/ApplicantStep';
import withApplication from '../../../lib/hoc/withApplication';
import {
  getQuestionsForFormAsValues,
  selectApplicant,
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import { isOver16 } from '../../../lib//utils/dateOfBirth';
import AddPersonForm from '../../../components/application/add-person-form';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };

  const applicant = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const isMainApplicant = applicant == mainResident;

  const dispatch = useAppDispatch();

  if (!applicant) {
    return <Custom404 />;
  }

  const [isOver16State, setIsOver16State] = useState(isOver16(applicant));

  const formFields = {
    ...getQuestionsForFormAsValues(FormID.PERSONAL_DETAILS, applicant),
    title: applicant.person?.title ?? '',
    firstName: applicant.person?.firstName ?? '',
    surname: applicant.person?.surname ?? '',
    gender: applicant.person?.gender ?? '',
    genderDescription: applicant.person?.genderDescription ?? '',
    dateOfBirth: applicant.person?.dateOfBirth ?? '',
    nationalInsuranceNumber: applicant.person?.nationalInsuranceNumber ?? '',
    phoneNumber: applicant.contactInformation?.phoneNumber ?? '',
    emailAddress: applicant.contactInformation?.emailAddress ?? '',
  };

  const onSubmit = ({
    title,
    firstName,
    surname,
    gender,
    genderDescription,
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
          id: applicant.person.id,
          title,
          firstName,
          surname,
          dateOfBirth,
          gender,
          genderDescription,
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
        personID: applicant.person.id,
        values,
        markAsComplete: true,
      })
    );

    router.push(`/apply/${resident}`);
  };

  return (
    <ApplicantStep
      applicant={applicant}
      stepName="Personal details"
      formID={FormID.PERSONAL_DETAILS}
    >
      <AddPersonForm
        initialValues={formFields}
        onSubmit={onSubmit}
        isMainApplicant={isMainApplicant}
        buttonText="Save and continue"
        isOver16={isOver16State}
        setIsOver16State={setIsOver16State}
      />
    </ApplicantStep>
  );
};

export default withApplication(ApplicationStep);
