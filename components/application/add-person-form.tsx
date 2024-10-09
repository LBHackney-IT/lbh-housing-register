import { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '../form/input';
import Select from '../form/select';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import Button from '../button';
import RadioConditional, {
  RadioConditionalProps,
} from '../form/radioconditional';
import * as Yup from 'yup';
import { getAgeInYearsFromDate } from '../../lib/utils/dateOfBirth';
import { isOver16 as isOver16Func } from '../../lib//utils/dateOfBirth';
import { Person, Applicant } from '../../domain/HousingApi';
import { getQuestionsForFormAsValues } from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';

interface FormValues {
  title: string | Person.TitleEnum;
  firstName: string;
  surname: string;
  relationshipType: string;
  gender: string;
  genderDescription: string;
  dateOfBirth: string;
  nationalInsuranceNumber: string;
  phoneNumber: string;
  emailAddress: string;
}

interface AddPersonFormProps {
  applicant: Applicant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: FormValues) => void | Promise<any>;
  isMainApplicant: boolean;
  buttonText: string;
  isOver16: boolean;
  setIsOver16State: (isOver16: boolean) => void;
}

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

export const relationshipOptions = [
  {
    label: 'Select an option',
    value: '',
  },
  {
    label: 'My aunt',
    value: 'aunt',
  },
  {
    label: 'My brother',
    value: 'brother',
  },
  {
    label: 'My cousin',
    value: 'cousin',
  },
  {
    label: 'My child',
    value: 'child',
  },
  {
    label: 'My friend',
    value: 'friend',
  },
  {
    label: 'My grandchild',
    value: 'grandchild',
  },
  {
    label: 'My grandparent',
    value: 'grandparent',
  },
  {
    label: 'My nephew',
    value: 'nephew',
  },
  {
    label: 'My niece',
    value: 'niece',
  },
  {
    label: 'My parent',
    value: 'parent',
  },
  {
    label: 'My partner',
    value: 'partner',
  },
  {
    label: 'My sister',
    value: 'sister',
  },
  {
    label: 'My uncle',
    value: 'uncle',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

const genderProps: RadioConditionalProps = {
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
        fieldName: 'genderDescription',
        label: 'Please enter your self-description',
        display: true,
      },
    },
  ],
};

const AddPersonForm = ({
  applicant,
  onSubmit,
  isMainApplicant,
  buttonText,
  isOver16,
  setIsOver16State,
}: AddPersonFormProps): JSX.Element => {
  const initialValues = {
    ...getQuestionsForFormAsValues(FormID.PERSONAL_DETAILS, applicant),
    title: applicant.person?.title ?? '',
    firstName: applicant.person?.firstName ?? '',
    surname: applicant.person?.surname ?? '',
    gender: applicant.person?.gender ?? '',
    genderDescription: applicant.person?.genderDescription ?? '',
    relationshipType: applicant.person?.relationshipType ?? '',
    dateOfBirth: applicant.person?.dateOfBirth ?? '',
    nationalInsuranceNumber: applicant.person?.nationalInsuranceNumber ?? '',
    phoneNumber: applicant.contactInformation?.phoneNumber ?? '',
    emailAddress: applicant.contactInformation?.emailAddress ?? '',
  };

  useEffect(() => {
    setIsOver16State(isOver16Func(applicant));
  }, [applicant]);

  function generateValidationSchema(isOver16: boolean) {
    const currentDateTimestamp = Math.min(+new Date());

    const schema = Yup.object({
      title: Yup.string().label('Title').required(),
      firstName: Yup.string().label('First name').required(),
      surname: Yup.string().label('Last name').required(),
      dateOfBirth: Yup.string()
        .notOneOf([INVALID_DATE], 'Invalid date')
        .label('Date of birth')
        .required()
        .test(
          'futureDate',
          'Your date of birth must be in the past',
          (value) => {
            if (typeof value !== 'string' || value === INVALID_DATE) {
              return false;
            }

            const dateOfBirth = +new Date(value);

            if (currentDateTimestamp < dateOfBirth) {
              return false;
            }

            return true;
          }
        )
        .test(
          'isOver16',
          'Main applicant must be over 16 years old',
          (value) => {
            if (typeof value !== 'string') {
              return false;
            }

            const dateOfBirth = new Date(value);
            const ageInYears = getAgeInYearsFromDate(dateOfBirth);

            if (ageInYears >= 16) {
              setIsOver16State(true);
              return true;
            }

            if (ageInYears < 16 && isMainApplicant) {
              return false;
            }

            setIsOver16State(false);
            return true;
          }
        ),
      gender: Yup.string().label('Gender').required(),
      relationshipType: Yup.string().label('Relationship to you').required(),
      nationalInsuranceNumber: Yup.string()
        .label('National Insurance number')
        .required(),
      phoneNumber: Yup.string().label('Phone number').required(),
      emailAddress: Yup.string().label('Email').email().required(),
    });

    if (isOver16) {
      if (isMainApplicant) {
        return schema.omit(['relationshipType']);
      } else {
        return schema.omit(['phoneNumber', 'emailAddress']);
      }
    } else {
      return schema.omit([
        'nationalInsuranceNumber',
        'phoneNumber',
        'emailAddress',
      ]);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={generateValidationSchema(isOver16)}
    >
      {({ isSubmitting }) => (
        <Form>
          <Select
            label={'Title'}
            name={'title'}
            options={titleOptions.map((title) => ({
              label: title.label,
              value: title.value,
            }))}
          />
          <Input name="firstName" label="First name" />
          <Input name="surname" label="Last name" />
          {!isMainApplicant ? (
            <Select
              label={'Relationship to you'}
              name={'relationshipType'}
              options={relationshipOptions.map((relationshipType) => ({
                label: relationshipType.label,
                value: relationshipType.value,
              }))}
            />
          ) : null}
          <DateInput
            name={'dateOfBirth'}
            label={'Date of birth'}
            hint={'For example, 31 3 1980'}
            showDay={true}
          />
          <RadioConditional
            value={genderProps.value}
            as={genderProps.as}
            name={genderProps.name}
            label={genderProps.label}
            hint={genderProps.hint}
            subheading={genderProps.subheading}
            details={genderProps.details}
            options={genderProps.options}
          />

          {isOver16 ? (
            <>
              <Input
                name="nationalInsuranceNumber"
                label="National Insurance number"
                hint="For example, AB 12 34 56 C"
              />
              {isMainApplicant ? (
                <>
                  <Input name="phoneNumber" label="Mobile number" />
                  <Input name="emailAddress" label="Email" type="email" />
                </>
              ) : null}
            </>
          ) : null}

          <div className="c-flex__1 text-right">
            <Button
              disabled={isSubmitting}
              type="submit"
              dataTestId="test-submit-form-button"
            >
              {buttonText}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddPersonForm;
