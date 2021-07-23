import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ApplicantStep from '../../../components/application/ApplicantStep';
import Button from '../../../components/button';
import InsetText from '../../../components/content/inset-text';
import Paragraph from '../../../components/content/paragraph';
import Details from '../../../components/details';
import DateInput from '../../../components/form/dateinput';
import Input from '../../../components/form/input';
import Label from '../../../components/form/label';
import Select from '../../../components/form/select';
import { AddressLookupAddress } from '../../../domain/addressLookup';
import { lookUpAddress } from '../../../lib/gateways/internal-api';
import { selectApplicant } from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID } from '../../../lib/utils/form-data';
import Custom404 from '../../404';

interface AddressHistoryEntry {
  postcode: string;
  date: string;
  address: AddressLookupAddress;
}
const REQUIRED_YEARS = 3;

// todo unit test me
function checkAddressHistory(
  entries: AddressHistoryEntry[],
  requiredYears: number
) {
  const [last] = entries.slice(-1);
  const lastDate = new Date(last.date);

  const requiredDate = new Date();
  requiredDate.setFullYear(requiredDate.getFullYear() - requiredYears);
  return lastDate <= requiredDate;
}
// unit test me too.
function calculateDurations(entries: AddressHistoryEntry[]) {
  let until = new Date();
  return entries.map((entry) => {
    const from = new Date(entry.date);

    const untilInMonths = until.getFullYear() * 12 + until.getMonth();
    const fromInMonths = from.getFullYear() * 12 + from.getMonth();

    const years = Math.floor((untilInMonths - fromInMonths) / 12);
    const months = (untilInMonths - fromInMonths) % 12;

    const r = {
      until,
      from,
      years,
      months,
      label: `${years} year${years !== 1 ? 's' : ''} ${months} month${
        months !== 1 ? 's' : ''
      } (${from.toLocaleString('default', {
        month: 'long',
      })} ${from.getFullYear()} – ${until.toLocaleString('default', {
        month: 'long',
      })} ${until.getFullYear()})`,
    };

    until = from;
    return r;
  });
}

// tood validate date entries. Each one needs to be older than the previous.

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };
  const applicant = useAppSelector(selectApplicant(resident));
  const dispatch = useAppDispatch();

  if (!applicant) {
    return <Custom404 />;
  }

  const initialValues = {
    postcode: '',
    address: '',
    date: '',
  };

  const [state, setState] =
    useState<'postcode-entry' | 'choose-address' | 'review'>('postcode-entry');

  const [postcodeResults, setPostcodeResults] = useState<
    AddressLookupAddress[]
  >([]);

  const [addressHistory, setAddressHistory] = useState<AddressHistoryEntry[]>(
    []
  );

  const durations = calculateDurations(addressHistory);

  const onSubmit = async (values: typeof initialValues) => {
    switch (state) {
      case 'postcode-entry':
        {
          const r = await lookUpAddress(values.postcode);
          setPostcodeResults(r.address);
          setState('choose-address');
        }
        break;

      case 'choose-address': {
        const newHistory = [
          ...addressHistory,
          {
            postcode: values.postcode,
            date: values.date,
            address: postcodeResults.find(
              (r) => r.UPRN.toString() === values.address
            )!,
          },
        ];
        setAddressHistory(newHistory);
        if (checkAddressHistory(newHistory, REQUIRED_YEARS)) {
          setState('review');
        } else {
          setState('postcode-entry');
        }
      }
    }
  };

  return (
    <ApplicantStep
      applicant={applicant}
      stepName="Address History"
      formID={FormID.ADDRESS_HISTORY}
    >
      <h2 className="lbh-heading-h2">Current Address</h2>
      <Details summary="Help with your address">
        If you have no fixed abode or if you are sofa surfing, use the address
        where you sleep for the majority of the week. If you are living on the
        {/* TODO link */}
        street, contact a <a href="#">housing officer</a>
      </Details>
      {addressHistory.map((entry, i) => (
        <>
          {i === 1 && <h2 className="lbh-heading-h2">Previous address</h2>}
          {i > 1 && <h2 className="lbh-heading-h2">Previous address {i}</h2>}
          <InsetText>
            <Label content={'Postcode'} strong />
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
              }}
            >
              <Paragraph>{entry.postcode}</Paragraph>
              <Button secondary>Change</Button>
            </div>

            <Label content={'Address'} strong />
            <Paragraph>
              {entry.address.line1} <br />
              {entry.address.line2} <br />
              {entry.address.line3} <br />
              {entry.address.line4} <br />
              {entry.address.town} <br />
              {entry.address.postcode} <br />
            </Paragraph>

            <Label content={'Time at address'} strong />
            <Paragraph>{durations[i].label}</Paragraph>
          </InsetText>
        </>
      ))}
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, values }) => (
          <Form>
            {state === 'postcode-entry' && (
              <>
                <Input name="postcode" label="Postcode" />
                <Button type="submit">Find address</Button>
              </>
            )}
            {state === 'choose-address' && (
              <InsetText>
                <Label content={'Postcode'} strong />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem',
                  }}
                >
                  <Paragraph>{values.postcode}</Paragraph>
                  <Button secondary>Change</Button>
                </div>
                <Select
                  label={'Select an address'}
                  name={'address'}
                  options={postcodeResults.map((address) => ({
                    label: address.line1 + ', ' + address.town,
                    value: address.UPRN.toString(),
                  }))}
                />

                <Button secondary>I can't find my address in the list</Button>
                <DateInput
                  name={'date'}
                  label={'When did you move to this address?'}
                  showDay={false}
                />
              </InsetText>
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
