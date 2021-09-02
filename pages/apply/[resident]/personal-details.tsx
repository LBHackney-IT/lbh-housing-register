import { Form, Formik, FormikValues } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import ApplicantStep from '../../../components/application/ApplicantStep';
import {
  getQuestionsForFormAsValues,
  selectApplicant,
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import Input from '../../../components/form/input';
import Select from '../../../components/form/select';
import DateInput from '../../../components/form/dateinput';
import RadioConditional, {
  RadioConditionalProps,
} from '../../../components/form/radioconditional';
import Button from '../../../components/button';
import { applicantEqualToOrOlderThanAge } from '../../../lib/utils/dateOfBirth';

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

  const isApplicantOver16 = applicantEqualToOrOlderThanAge(applicant, 16);

  const initialValues = {
    ...getQuestionsForFormAsValues(FormID.PERSONAL_DETAILS, applicant),
    title: applicant.person?.title,
    firstName: applicant.person?.firstName,
    surname: applicant.person?.surname,
    gender: applicant.person?.gender,
    dateOfBirth: applicant.person?.dateOfBirth,
    nationalInsuranceNumber: applicant.person?.nationalInsuranceNumber,
    phoneNumber: applicant.contactInformation?.phoneNumber,
    emailAddress: applicant.contactInformation?.emailAddress,
  };

  const onSave = ({
    title,
    firstName,
    surname,
    gender,
    dateOfBirth,
    nationalInsuranceNumber,
    phoneNumber,
    emailAddress,
    ...values
  }: FormikValues) => {
    if (!isApplicantOver16) {
      nationalInsuranceNumber = '';
    }

    if (!isMainApplicant) {
      nationalInsuranceNumber = '';
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

  const options = [
    {
      label: 'Select an option',
      value: '',
    },
    {
      label: 'Mr',
      value: 'Mr',
    },
    {
      label: 'Mrs',
      value: 'Mrs',
    },
    {
      label: 'Miss',
      value: 'Miss',
    },
    {
      label: 'Ms',
      value: 'Ms',
    },
    {
      label: 'Mx',
      value: 'Mx',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];

  const radioProps: RadioConditionalProps = {
    value: '',
    as: 'radioconditional',
    label: 'Gender',
    name: 'gender',
    options: [
      {
        label: 'Male',
        value: 'M',
      },
      {
        label: 'Female',
        value: 'F',
      },
      {
        label: 'Prefer to self-describe',
        value: 'self',
        conditionalFieldInput: {
          as: 'input',
          containerId: 'self-describe-text-values',
          fieldId: 'self-describe',
          fieldName: 'self-describe',
          label: 'Please enter your self-description',
          display: true,
        },
      },
    ],
  };

  return (
    <ApplicantStep
      applicant={applicant}
      stepName="Personal details"
      formID={FormID.PERSONAL_DETAILS}
    >
      <Formik initialValues={initialValues} onSubmit={onSave}>
        {({ isSubmitting, values }) => (
          <Form>
            <Select
              label={'title'}
              name={'title'}
              options={options.map((address) => ({
                label: address.label,
                value: address.value,
              }))}
            />
            <Input name="firstName" label="First name" />
            <Input name="surname" label="Last name" />
            <DateInput
              name={'dateOfBirth'}
              label={'Date of birth'}
              showDay={true}
            />
            <RadioConditional
              value={radioProps.value}
              as={radioProps.as}
              hint={radioProps.hint}
              label={radioProps.label}
              details={radioProps.details}
              name={radioProps.name}
              options={radioProps.options}
              subheading={radioProps.subheading}
            />

            {isApplicantOver16 && (
              <Input
                name="nationalInsuranceNumber"
                label="National Insurance number"
                hint="For example, AB 12 34 56 C"
              />
            )}

            {isMainApplicant && (
              <>
                <Input name="phoneNumber" label="Mobile number" />
                <Input type="email" label="email" name="emailAddress" />
              </>
            )}

            <div className="c-flex__1 text-right">
              <Button disabled={isSubmitting} type="submit">
                Save and continue
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ApplicantStep>
  );
};

export default ApplicationStep;
