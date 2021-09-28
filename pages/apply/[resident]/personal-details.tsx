import { Form, Formik, FormikValues } from 'formik';
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
import Input from '../../../components/form/input';
import Select from '../../../components/form/select';
import DateInput, { INVALID_DATE } from '../../../components/form/dateinput';
import RadioConditional, {
  RadioConditionalProps,
} from '../../../components/form/radioconditional';
import Button from '../../../components/button';
import * as Yup from 'yup';
import {
  getAgeInYearsFromDate,
  isOver16,
} from '../../../lib//utils/dateOfBirth';
import { formatDate } from '../../../lib/utils/form';

type State = 'under-sixteen' | 'over-sixteen';

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

  const [state, setState] = useState<State>(
    isOver16(applicant) ? 'over-sixteen' : 'under-sixteen'
  );

  const initialValues = {
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

  const onSave = ({
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
    if (state === 'under-sixteen') {
      nationalInsuranceNumber = '';
    }

    if (!isMainApplicant) {
      nationalInsuranceNumber = '';
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

  const titleOptions = [
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

  const genderProps: RadioConditionalProps = {
    value: '',
    as: 'radioconditional',
    label: 'Gender',
    name: 'gender',
    displayLabel: true,
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
          fieldName: 'genderDescription',
          label: 'Please enter your self-description',
          display: true,
        },
      },
    ],
  };

  function generateValidationSchema(state: State) {
    const min = Math.min(+new Date());

    const schema = Yup.object({
      dateOfBirth: Yup.string()
        .notOneOf([INVALID_DATE], 'Invalid date')
        .label('Date of birth')
        .required()
        .test(
          'min',
          '${path} must be before ' + formatDate(new Date(min)),
          (value) => {
            if (typeof value !== 'string' || value === INVALID_DATE) {
              return false;
            }

            const dateOfBirth = new Date(value);
            const ageInYears = getAgeInYearsFromDate(dateOfBirth);

            if (ageInYears >= 16) {
              setState('over-sixteen');
              return true;
            }

            setState('under-sixteen');
            return true;
          }
        ),
      title: Yup.string().label('Title').required(),
      firstName: Yup.string().label('First name').required(),
      surname: Yup.string().label('Last name').required(),
      gender: Yup.string().label('Gender').required(),
      nationalInsuranceNumber: Yup.string()
        .label('National Insurance number')
        .required(),
      phoneNumber: Yup.string().label('Phone number').required(),
      emailAddress: Yup.string().label('Email').email().required(),
    });

    switch (state) {
      case 'under-sixteen':
        return schema.pick([
          'title',
          'firstName',
          'surname',
          'dateOfBirth',
          'gender',
        ]);
      case 'over-sixteen':
        return isMainApplicant
          ? schema.pick([
              'title',
              'firstName',
              'surname',
              'dateOfBirth',
              'gender',
              'nationalInsuranceNumber',
              'phoneNumber',
              'emailAddress',
            ])
          : schema.pick([
              'title',
              'firstName',
              'surname',
              'dateOfBirth',
              'gender',
              'nationalInsuranceNumber',
            ]);
    }
  }

  return (
    <ApplicantStep
      applicant={applicant}
      stepName="Personal details"
      formID={FormID.PERSONAL_DETAILS}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSave}
        validationSchema={generateValidationSchema(state)}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Select
              displayLabel={true}
              label={'Title'}
              name={'title'}
              options={titleOptions.map((title) => ({
                label: title.label,
                value: title.value,
              }))}
            />
            <Input name="firstName" label="First name" displayLabel={true} />
            <Input name="surname" label="Last name" displayLabel={true} />
            <DateInput
              displayLabel={true}
              name={'dateOfBirth'}
              label={'Date of birth'}
              showDay={true}
            />
            <RadioConditional
              displayLabel={true}
              value={genderProps.value}
              as={genderProps.as}
              name={genderProps.name}
              label={genderProps.label}
              hint={genderProps.hint}
              subheading={genderProps.subheading}
              details={genderProps.details}
              options={genderProps.options}
            />

            {state === 'over-sixteen' && (
              <Input
                displayLabel={true}
                name="nationalInsuranceNumber"
                label="National Insurance number"
                hint="For example, AB 12 34 56 C"
              />
            )}

            {isMainApplicant && (
              <>
                <Input
                  name="phoneNumber"
                  label="Mobile number"
                  displayLabel={true}
                />
                <Input
                  name="emailAddress"
                  label="Email"
                  type="email"
                  displayLabel={true}
                />
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

export default withApplication(ApplicationStep);
