import router from 'next/router';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { Application } from '../../domain/HousingApi';
import Button from '../button';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import Select from '../form/select';
import Radios from '../form/radios';
import Input from '../form/input';
import InsetText from '../content/inset-text';
import { updateApplication } from '../../lib/gateways/internal-api';
import { ApplicationStatus } from '../../lib/types/application-status';
import { calculateBedroomsFromApplication } from '../../lib/utils/bedroomCalculator';

interface PageProps {
  data: Application;
}

export default function Actions({ data }: PageProps): JSX.Element {
  const statusOptions = [
    {
      label: 'Select an option',
      value: '',
    },
    {
      label: 'Awaiting assessment',
      value: ApplicationStatus.SUBMITTED,
    },
    {
      label: 'Active',
      value: ApplicationStatus.ACTIVE,
    },
    {
      label: 'Referred for approval',
      value: ApplicationStatus.REFERRED,
    },
    {
      label: 'Rejected by officer',
      value: ApplicationStatus.REJECTED,
    },
    {
      label: 'Rejected by system',
      value: ApplicationStatus.DISQUALIFIED,
    },
    {
      label: 'Pending',
      value: ApplicationStatus.PENDING,
    },
    {
      label: 'Cancelled',
      value: ApplicationStatus.CANCELLED,
    },
    {
      label: 'Housed',
      value: ApplicationStatus.HOUSED,
    },
    {
      label: 'Active and under appeal',
      value: ApplicationStatus.ACTIVE_UNDER_APPEAL,
    },
    {
      label: 'Inactive and under appeal',
      value: ApplicationStatus.INACTIVE_UNDER_APPEAL,
    },
    {
      label: 'Suspended',
      value: ApplicationStatus.SUSPENDED,
    },
    {
      label: 'Incomplete',
      value: ApplicationStatus.DRAFT,
    },
  ];

  const reasonOptions = [
    { label: 'Select an option', value: '' },
    { label: '"A" disrepair', value: 'a-disrepair' },
    { label: '"A" medical awarded', value: 'a-medical-awarded' },
    { label: '"A" Overcrowding', value: 'a-overcrowding' },
    { label: '"A" social', value: 'a-social' },
    {
      label: 'Accepted Part V1 Application',
      value: 'accepted-part-v1-application',
    },
    {
      label: 'Accepted Homeless Application',
      value: 'accepted-homeless-application',
    },
    { label: 'Appeal overturned', value: 'appeal-overturned' },
    { label: 'Appeal upheld', value: 'appeal-upheld' },
    {
      label: 'Awaiting further information',
      value: 'awaiting-further-information',
    },
    { label: '"B" medical awarded', value: 'b-medical-awarded' },
    { label: '"B" social', value: 'b-social' },
    {
      label: 'Capital assets exceeds £80,000',
      value: 'capital-assets-exceeds-80-000',
    },
    { label: 'Change of address', value: 'change-of-address' },
    {
      label: 'Change of name/title',
      value: 'change-of-name-title',
    },
    { label: 'Connected carer', value: 'connected-carer' },
    { label: 'ECP', value: 'ecp' },
    {
      label: 'Extensive support needs',
      value: 'extensive-support-needs',
    },
    {
      label: 'Failed residential criteria',
      value: 'failed-residential-criteria',
    },
    {
      label: 'Failed to provide information',
      value: 'failed-to-provide-information',
    },
    { label: 'Foster carer', value: 'foster-carer' },
    { label: 'Fraud', value: 'fraud' },
    {
      label: 'Housed into Council property',
      value: 'housed-into-council-property',
    },
    {
      label: 'Housed into Housing Association property',
      value: 'housed-into-housing-association-property',
    },
    {
      label: 'Housed into private rented sector',
      value: 'housed-into-private-rented-sector',
    },
    {
      label: 'Household income exceeds £80,000/£100,000 pa',
      value: 'household-income-exceeds-80-000-100-000-pa',
    },
    {
      label: 'Household member moved in',
      value: 'household-member-moved-in',
    },
    {
      label: 'Household member moved out',
      value: 'household-member-moved-out',
    },
    { label: 'Misrepresentation', value: 'misrepresentation' },
    { label: 'Multiple needs', value: 'multiple-needs' },
    { label: 'New born baby', value: 'new-born-baby' },
    { label: 'No medical awarded', value: 'no-medical-awarded' },
    {
      label: 'Non-TNT underoccupation',
      value: 'non-tnt-underoccupation',
    },
    { label: 'Not eligible', value: 'not-eligible' },
    { label: 'Permanent decant', value: 'permanent-decant' },
    {
      label: 'Reduced Priority - worsened housing situation',
      value: 'reduced-priority-worsened-housing-situation',
    },
    {
      label: "Over 55ys - Older Person's Housing",
      value: 'over-55ys-older-person-s-housing',
    },
    { label: 'Owner Occupier', value: 'owner-occupier' },
    { label: 'Quota', value: 'quota' },
    {
      label: 'Significant household member birthday',
      value: 'significant-household-member-birthday',
    },
    {
      label: 'Squatter/Unauthorised occupant',
      value: 'squatter-unauthorised-occupant',
    },
    { label: 'Temporary decant', value: 'temporary-decant' },
    { label: 'TNT underoccpation', value: 'tnt-underoccpation' },
    {
      label: 'Unauthorised subletting',
      value: 'unauthorised-subletting',
    },
    { label: 'Under 18yrs', value: 'under-18yrs' },
  ];

  const schema = Yup.object({
    status: Yup.string()
      .label('Status')
      .required()
      .oneOf(statusOptions.map(({ value }) => value)),
    reason: Yup.string()
      .label('Reason')
      .oneOf(reasonOptions.map(({ value }) => value)),
    applicationDate: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    informationReceived: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    bedroomNeed: Yup.number().label('Bedroom need').min(1),
    band: Yup.string(),
    biddingNumberType: Yup.string().oneOf(['generate', 'manual']),
    biddingNumber: Yup.string().matches(
      /^\d{7}$/,
      'Bidding number should be a 7 digit number'
    ),
  });

  const initialValues = {
    status: data.status ?? '',
    reason: data.assessment?.reason ?? '',
    applicationDate: data.assessment?.effectiveDate ?? '',
    informationReceived: data.assessment?.informationReceivedDate ?? '',
    bedroomNeed:
      data.assessment?.bedroomNeed ?? calculateBedroomsFromApplication(data),
    band: data.assessment?.band ?? '',
    biddingNumberType: data.assessment?.biddingNumber ? 'manual' : 'generate',
    biddingNumber: data.assessment?.biddingNumber ?? '',
  };

  function showDecisionOptions(values: FormikValues): boolean {
    return (
      values.status === ApplicationStatus.ACTIVE ||
      values.status === ApplicationStatus.ACTIVE_UNDER_APPEAL
    );
  }

  function showInformationReceived(values: FormikValues): boolean {
    return (
      values.status === ApplicationStatus.ACTIVE ||
      values.status === ApplicationStatus.ACTIVE_UNDER_APPEAL ||
      values.status === ApplicationStatus.REJECTED ||
      values.status === ApplicationStatus.CANCELLED
    );
  }

  function onSubmit(values: FormikValues) {
    const request: Application = {
      id: data.id,
      status: values.status,
      assessment: {
        ...data.assessment,
        reason: values.reason,
      },
    };

    if (values.applicationDate && request.assessment) {
      request.assessment.effectiveDate = values.applicationDate;
    }
    if (values.informationReceived && request.assessment) {
      request.assessment.informationReceivedDate = values.applicationDate;
    }

    if (showDecisionOptions(values) && request.assessment) {
      request.assessment.bedroomNeed = +values.bedroomNeed;
      request.assessment.band = values.band;
      request.assessment.biddingNumber = values.biddingNumber;
      request.assessment.generateBiddingNumber =
        values.biddingNumberType === 'generate';
    }

    updateApplication(request);
    setTimeout(() => router.reload(), 500);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Select label="Status" name="status" options={statusOptions} />
          <Select label="Reason" name="reason" options={reasonOptions} />
          <DateInput name={'applicationDate'} label={'Application date'} />
          {showInformationReceived(values) && (
            <DateInput
              name={'informationReceived'}
              label={'All information received'}
            />
          )}
          {showDecisionOptions(values) && (
            <>
              <Input
                name="bedroomNeed"
                label="Bedroom need"
                className="govuk-input--width-2"
              />
              <Radios
                label="Band"
                name="band"
                options={[
                  { label: 'Band A', value: 'A' },
                  { label: 'Band B', value: 'B' },
                  { label: 'Band C', value: 'C' },
                  { label: 'Band C (transitional)', value: 'C-transitional' },
                ]}
              />
              <Radios
                label="Bidding number"
                name="biddingNumberType"
                options={[
                  { label: 'Generate bidding number', value: 'generate' },
                  { label: 'Use existing bidding number', value: 'manual' },
                ]}
              />
              {values.biddingNumberType === 'manual' && (
                <InsetText>
                  <Input
                    name="biddingNumber"
                    label="Bidding number"
                    className="govuk-input--width-10"
                  />
                </InsetText>
              )}
            </>
          )}

          <div className="c-flex lbh-simple-pagination">
            <div className="c-flex__1 text-right">
              <Button disabled={isSubmitting} type="submit">
                Save changes
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
