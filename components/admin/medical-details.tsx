import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Form, Formik, FormikValues } from 'formik';
import { Application } from '../../domain/HousingApi';
import { applicantHasId } from '../../lib/store/applicant';
import { formatDate } from '../../lib/utils/dateOfBirth';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import { updateApplication } from '../../lib/gateways/internal-api';
import React, { useState } from 'react';
import Button from '../button';
import Select from '../form/select';
import { HeadingThree } from '../content/headings';
import Paragraph from '../content/paragraph';
import Textarea from '../form/textarea';
import { applicantHasMedicalNeed } from '../../lib/utils/medicalNeed';
import ErrorSummary from '../errors/error-summary';
import { toUserErrorMessage } from '../../lib/utils/errorHelper';
import { scrollToTop } from '../../lib/utils/scroll';

export interface MedicalDetailPageProps {
  data: Application;
  memberIndex: number;
}

function optionLabel(
  options: { label: string; value: string }[],
  value?: string | null,
): string | undefined {
  if (!value) {
    return undefined;
  }

  return options.find((option) => option.value === value)?.label;
}

export default function MedicalDetail({
  data,
  memberIndex,
}: MedicalDetailPageProps): JSX.Element {
  const router = useRouter();
  const applicant =
    data.otherMembers && memberIndex > -1
      ? data.otherMembers[memberIndex]
      : data.mainApplicant;
  const [editing, setEditing] = useState(false);
  const [medicalNeed, setMedicalNeed] = useState(applicant?.medicalNeed);
  const [userError, setUserError] = useState<string | undefined>(undefined);

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
    dateFormRecieved: Yup.string()
      .label('Date form received')
      .notOneOf([INVALID_DATE], 'Invalid date')
      .required(),
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

  const initialValues: FormikValues = {
    dateFormRecieved: medicalNeed?.formRecieved ?? '',
    assessmentDate: medicalNeed?.assessmentDate ?? '',
    outcome: medicalNeed?.outcome ?? '',
    accessibleHousingRegister: medicalNeed?.accessibileHousingRegister ?? '',
    disability: medicalNeed?.disability ?? '',
    additionalInformation: medicalNeed?.additionalInformaton ?? '',
  };

  async function onSubmit(values: FormikValues) {
    if (!applicantHasId(applicant)) {
      return;
    }

    const nextMedicalNeed = {
      formRecieved: values.dateFormRecieved,
      assessmentDate:
        values.assessmentDate !== '' ? values.assessmentDate : null,
      outcome: values.outcome,
      accessibileHousingRegister: values.accessibleHousingRegister,
      disability: values.disability,
      additionalInformaton: values.additionalInformation,
    };

    // update household member or main applicant
    const request: Application =
      data.otherMembers && memberIndex > -1
        ? {
            id: data.id,
            otherMembers: data.otherMembers.map((member, index) =>
              index === memberIndex
                ? { ...member, medicalNeed: nextMedicalNeed }
                : member,
            ),
          }
        : {
            id: data.id,
            mainApplicant: {
              ...data.mainApplicant,
              medicalNeed: nextMedicalNeed,
            },
          };

    setUserError(undefined);

    try {
      await updateApplication(request);
      setMedicalNeed({
        ...nextMedicalNeed,
        assessmentDate: nextMedicalNeed.assessmentDate ?? undefined,
      });
      setEditing(false);
      await router.replace(router.asPath);
    } catch (error) {
      setUserError(toUserErrorMessage(error, 'Unable to save medical details'));
      scrollToTop();
    }
  }

  const hasMedicalNeed = applicantHasMedicalNeed(applicant);
  const savedDetails = [
    {
      title: 'Assessment requested',
      value: hasMedicalNeed ? 'Yes' : 'No',
    },
    {
      title: 'Date form received',
      value: formatDate(medicalNeed?.formRecieved),
    },
    {
      title: 'Assessment date',
      value: formatDate(medicalNeed?.assessmentDate),
    },
    {
      title: 'Outcome',
      value: optionLabel(outcomeOptions, medicalNeed?.outcome),
    },
    {
      title: 'Accessible Housing Register',
      value: optionLabel(
        accessibleHousingRegisterOptions,
        medicalNeed?.accessibileHousingRegister,
      ),
    },
    {
      title: 'Disability',
      value: optionLabel(disabilityOptions, medicalNeed?.disability),
    },
    {
      title: 'Additional information',
      value: medicalNeed?.additionalInformaton,
    },
  ].filter((detail) => detail.value);

  if (!editing) {
    return (
      <>
        <HeadingThree content="Medical need" />
        <table className="govuk-table lbh-table">
          <tbody className="govuk-table__body">
            {savedDetails.map((detail) => (
              <tr key={detail.title} className="govuk-table__row">
                <th scope="row" className="govuk-table__header">
                  {detail.title}
                </th>
                <td className="govuk-table__cell">{detail.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMedicalNeed && (
          <Button secondary type="button" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          {userError && (
            <ErrorSummary dataTestId="test-medical-details-error-summary">
              {userError}
            </ErrorSummary>
          )}
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
                <Button
                  secondary
                  className="lbh-button--inline"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="lbh-button--inline"
                  disabled={isSubmitting}
                  type="submit"
                >
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
