import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import ApplicantStep from '../../../components/application/ApplicantStep';
import Form from '../../../components/form/form';
import {
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { selectApplicant } from '../../../lib/store/application';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { mapApplicantToValues } from '../../../lib/utils/application-forms';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };
  const applicant = useAppSelector(selectApplicant(resident));
  const dispatch = useAppDispatch();

  if (!applicant) {
    return <Custom404 />;
  }

  const initialValues = {
    ...mapApplicantToValues(FormID.PERSONAL_DETAILS, applicant),
    firstName: applicant.person?.firstName,
    surname: applicant.person?.surname,
    // birthday: applicant.person?.dateOfBirth,
    gender: applicant.person?.gender,
    phoneNumber: applicant.contactInformation?.phoneNumber,
    emailAddress: applicant.contactInformation?.emailAddress,
  };

  const onSave = ({
    firstName,
    surname,
    gender,
    phoneNumber,
    emailAddress,
    ...values
  }: FormikValues) => {
    dispatch(
      updateApplicant({
        person: {
          firstName,
          surname,
          // dateOfBirth: values.birthday,
          gender,
        },
        contactInformation: {
          phoneNumber,
          emailAddress,
        },
      })
    );
    dispatch(
      updateWithFormValues({ activeStepId: FormID.PERSONAL_DETAILS, values })
    );
  };

  const onSubmit = async () => {
    router.push(`/apply/${resident}`);
  };

  return (
    <ApplicantStep
      applicant={applicant}
      stepName="Personal details"
      formID={FormID.PERSONAL_DETAILS}
    >
      <Form
        buttonText="Save and continue"
        initialValues={initialValues}
        formData={getFormData(FormID.PERSONAL_DETAILS)}
        onSave={onSave}
        onSubmit={onSubmit}
      />
    </ApplicantStep>
  );
};

export default ApplicationStep;
