import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Application } from '../../domain/HousingApi';

import { FormID, getFormData } from '../../lib/utils/form-data';
import Button from '../button';
import DateInput from '../form/dateinput';
import Select from '../form/select';
import Radios from '../form/radios';
import Input from '../form/input';
import InsetText from '../content/inset-text';

interface PageProps {
  data: Application;
}

const actionOptions = [
  {
    label: 'Select an option',
    value: '',
  },
  {
    label: 'Awaiting Assessment',
    value: 'awaiting-assessment',
  },
  {
    label: 'Activate',
    value: 'activate',
  },
  {
    label: 'Refer for approval',
    value: 'refer-for-approval',
  },
  {
    label: 'Reject',
    value: 'reject',
  },
  {
    label: 'Move to Pending',
    value: 'move-to-pending',
  },
  {
    label: 'Cancel',
    value: 'cancel',
  },
  {
    label: 'Housed',
    value: 'housed',
  },
  {
    label: 'Active and under appeal',
    value: 'active-and-under-appeal',
  },
  {
    label: 'Inactive and under appeal',
    value: 'inactive-and-under-appeal',
  },
  {
    label: 'Suspend',
    value: 'suspend',
  },
  {
    label: 'Transition Band',
    value: 'transition-band',
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
  action: Yup.string()
    .label('Action')
    .required()
    .oneOf(actionOptions.map(({ value }) => value)),
  reason: Yup.string()
    .label('Reason')
    .oneOf(reasonOptions.map(({ value }) => value)),
  applicationDate: Yup.string(),
  informationRecieved: Yup.string(),
  band: Yup.string(),
  biddingNumberType: Yup.string().oneOf(['generate', 'manual']),
  biddingNumber: Yup.string(),
});
const initialValues = schema.getDefault();

function onSubmit() {
  console.log('//todo');
}

export default function Actions({ data }: PageProps): JSX.Element {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Select label="Action" name="action" options={actionOptions} />
          <Select label="Reason" name="reason" options={reasonOptions} />
          <DateInput name={'applicationDate'} label={'Application date'} />
          <DateInput
            name={'informationReceived'}
            label={'All information received'}
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
              <Input name="biddingNumber" label="Bidding number" className="" />
            </InsetText>
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
