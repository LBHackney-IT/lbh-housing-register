import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Form, Formik, FormikValues } from 'formik';
import { Applicant, Application } from '../../domain/HousingApi';
import { applicantHasId } from '../../lib/store/applicant';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import { updateApplication } from '../../lib/gateways/internal-api';
import React from 'react';
import Button from '../button';
import Select from '../form/select';
import { HeadingThree } from '../content/headings';
import Paragraph from '../content/paragraph';
import Textarea from '../form/textarea';
import { applicantHasMedicalNeed } from '../../lib/utils/medicalNeed';

export interface MedicalDetailPageProps {
  data: Application;
  memberIndex: number;
}

export default function MedicalDetail({
  data,
  memberIndex,
}: MedicalDetailPageProps): JSX.Element {
  const router = useRouter();

  const outcomeOptions = [
    {
      label: 'Select an option',
      value: '',
    },
    {
      label: '"A" Medical awarded',
      value: 'a-medical-awarded',
    },
    {
      label: '"B" Medical awarded',
      value: 'b-medical-awarded',
    },
    {
      label: '"A" Medical awarded with additional bedroom',
      value: 'a-medical-awarded-with-additional-bedroom',
    },
    {
      label: '"B" Medical awarded with additional bedroom',
      value: 'b-medical-awarded-with-additional-bedroom',
    },
    {
      label: 'Additional bedroom awarded',
      value: 'additional-bedroom-awarded',
    },
    {
      label: 'No medical awarded',
      value: 'no-medical-awarded',
    },
    {
      label: 'Vulnerable',
      value: 'vulnerable',
    },
    {
      label: 'Not vulnerable',
      value: 'not-vulnerable',
    },
    {
      label: 'Suitable',
      value: 'suitable',
    },
    {
      label: 'Not suitable',
      value: 'not-suitable',
    },
    {
      label: 'Recommendation',
      value: 'recommendation',
    },
    {
      label: 'No recommendation',
      value: 'no-recommendation',
    },
  ];
  const accessibleHousingRegisterOptions = [
    {
      label: 'Select an option',
      value: '',
    },
    {
      label: 'A/B wheelchair standard',
      value: 'a-b-wheelchair-standard',
    },
    {
      label: 'C/D Large level access',
      value: 'c-d-large-level-access',
    },
    {
      label: 'E step free - level access',
      value: 'e-step-free-level-access',
    },
    {
      label: 'E+ minimal steps up to 4 steps',
      value: 'e-minimal-steps-up-to-4-steps',
    },
    {
      label: 'E Ground floor and level access shower',
      value: 'e-ground-floor-and-level-access-shower',
    },
    {
      label: 'E+ Up to 4 steps and level access shower',
      value: 'e-up-to-4-steps-and-level-access-shower',
    },
    {
      label: 'F general needs - any floor',
      value: 'f-general-needs-any-floor',
    },
    {
      label: 'F any floor with level access shower',
      value: 'f-any-floor-with-level-access-shower',
    },
    {
      label: 'Stairlift',
      value: 'stairlift',
    },
  ];
  const disabilityOptions = [
    {
      label: 'Select an option',
      value: '',
    },
    {
      label: 'Visual impairment',
      value: 'visual-impairment',
    },
    {
      label: 'Mobility',
      value: 'mobility',
    },
    {
      label: 'Learning difficulties',
      value: 'learning-difficulties',
    },
    {
      label: 'Mental Health',
      value: 'mental-health',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ];

  const schema = Yup.object({
    dateFormRecieved: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    assessmentDate: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    outcome: Yup.string()
      .label('Outcome')
      .oneOf(outcomeOptions.map(({ value }) => value)),
    accessibleHousingRegister: Yup.string()
      .label('Accessible Housing Register')
      .oneOf(accessibleHousingRegisterOptions.map(({ value }) => value)),
    disability: Yup.string()
      .label('Disability')
      .oneOf(disabilityOptions.map(({ value }) => value)),
    additionalInformation: Yup.string(),
  });

  const applicant =
    data.otherMembers && memberIndex > -1
      ? data.otherMembers[memberIndex]
      : data.mainApplicant;
  var initialValues: FormikValues = {
    dateFormRecieved: applicant?.medicalNeed?.formRecieved ?? '',
    assessmentDate: applicant?.medicalNeed?.assessmentDate ?? '',
    outcome: applicant?.medicalNeed?.outcome ?? '',
    accessibleHousingRegister:
      applicant?.medicalNeed?.accessibileHousingRegister ?? '',
    disability: applicant?.medicalNeed?.disability ?? '',
    additionalInformation: applicant?.medicalNeed?.additionalInformaton ?? '',
  };

  function onSubmit(values: FormikValues) {
    if (applicantHasId(applicant)) {
      // update household member or main applicant
      if (data.otherMembers && memberIndex > -1) {
        data.otherMembers[memberIndex].medicalNeed = {
          formRecieved: values.dateFormRecieved,
          assessmentDate:
            values.assessmentDate !== '' ? values.assessmentDate : null,
          outcome: values.outcome,
          accessibileHousingRegister: values.accessibleHousingRegister,
          disability: values.disability,
          additionalInformaton: values.additionalInformation,
        };
        const request: Application = {
          id: data.id,
          otherMembers: data.otherMembers,
        };
        updateApplication(request);
      } else {
        const request: Application = {
          id: data.id,
          mainApplicant: {
            ...data.mainApplicant,
            medicalNeed: {
              formRecieved: values.dateFormRecieved,
              assessmentDate:
                values.assessmentDate !== '' ? values.assessmentDate : null,
              outcome: values.outcome,
              accessibileHousingRegister: values.accessibleHousingRegister,
              disability: values.disability,
              additionalInformaton: values.additionalInformation,
            },
          },
        };
        updateApplication(request);
      }

      setTimeout(() => router.reload(), 500);
    }
  }

  const hasMedicalNeed = applicantHasMedicalNeed(applicant);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-third">
              <HeadingThree content="Medical need" />
            </div>
          </div>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <Paragraph>
                <strong>Assessment requested:</strong>{' '}
                {hasMedicalNeed ? 'Yes' : 'No'}
              </Paragraph>
              {hasMedicalNeed && (
                <DateInput
                  name={'dateFormRecieved'}
                  label={'Date form received'}
                />
              )}
            </div>
          </div>

          {hasMedicalNeed && values.dateFormRecieved && (
            <>
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                  <HeadingThree content="Medical outcome" />
                </div>
              </div>
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                  <DateInput
                    name={'assessmentDate'}
                    label={'Assessment Date'}
                  />
                  <Select
                    label="Outcome"
                    name="outcome"
                    options={outcomeOptions}
                  />
                  <Select
                    label="Accessible Housing Register"
                    name="accessibleHousingRegister"
                    options={accessibleHousingRegisterOptions}
                  />
                  <Select
                    label="Disability"
                    name="disability"
                    options={disabilityOptions}
                  />
                  <Textarea
                    label="Additional information"
                    name="additionalInformation"
                    as={'textarea'}
                  />
                </div>
              </div>
            </>
          )}

          {hasMedicalNeed && (
            <div className="c-flex lbh-simple-pagination">
              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
