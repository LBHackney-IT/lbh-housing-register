import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as Yup from 'yup';
import ApplicantStep from '../../../components/application/ApplicantStep';
import Button from '../../../components/button';
import InsetText from '../../../components/content/inset-text';
import Paragraph from '../../../components/content/paragraph';
import Details from '../../../components/details';
import DateInput, { INVALID_DATE } from '../../../components/form/dateinput';
import Input from '../../../components/form/input';
import Label from '../../../components/form/label';
import Select from '../../../components/form/select';
import { AddressLookupAddress } from '../../../domain/addressLookup';
import { AddressType } from '../../../domain/HousingApi';
import { lookUpAddress } from '../../../lib/gateways/internal-api';
import {
  getQuestionValue,
  selectApplicant,
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import {
  AddressHistoryEntry,
  calculateDurations,
  checkAddressHistory,
  formatDate,
} from '../../../lib/utils/addressHistory';
import { FormID } from '../../../lib/utils/form-data';
import Custom404 from '../../404';

const REQUIRED_YEARS = 5;

type State = 'postcode-entry' | 'manual-entry' | 'choose-address' | 'review';

function generateValidationSchema(
  state: State,
  addressHistory: AddressHistoryEntry[]
) {
  const min = Math.min(
    +new Date(),
    ...addressHistory.map((e) => +new Date(e.date))
  );

  const schema = Yup.object({
    date: Yup.string()
      .notOneOf([INVALID_DATE], 'Invalid date')
      .label('When did you move to this address')
      .required()
      .test(
        'min',
        '${path} must be before ' + formatDate(new Date(min)),
        (value) => {
          if (typeof value !== 'string' || value === INVALID_DATE) {
            return false;
          }
          const d = +new Date(value);
          return d < min;
        }
      ),
    dateTo: Yup.string()
      .notOneOf([INVALID_DATE], 'Invalid date')
      .label('When did you leave this address')
      .required()
      .test(
        'min',
        '${path} must be before ' + formatDate(new Date(min)),
        (value) => {
          if (typeof value !== 'string' || value === INVALID_DATE) {
            return false;
          }
          const d = +new Date(value);
          return d < min;
        }
      ),
    postcode: Yup.string().label('Postcode').required(),
    uprn: Yup.string().label('Address').required(),
    address: Yup.object({
      line1: Yup.string().label('Building and street').required(),
      line2: Yup.string(),
      town: Yup.string().label('Town or city').required(),
      county: Yup.string().label('County').required(),
    }),
  });

  switch (state) {
    case 'postcode-entry':
      return schema.pick(['postcode']);
    case 'manual-entry':
      return addressHistory.length === 0
        ? schema.pick(['postcode', 'address', 'date'])
        : schema.pick(['postcode', 'address', 'date', 'dateTo']);
    case 'choose-address':
      return addressHistory.length === 0
        ? schema.pick(['uprn', 'date'])
        : schema.pick(['uprn', 'date', 'dateTo']);
  }
}

function ManualEntry() {
  return (
    // These all need the validation markers. And that's why we need the standard inputs.
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h1 className="govuk-fieldset__heading">What is your address?</h1>
      </legend>

      <Input
        name="address.line1"
        autoComplete="address-line1"
        label={
          <>
            Building and street{' '}
            <span className="govuk-visually-hidden">line 1 of 2</span>
          </>
        }
      />
      <Input
        name="address.line2"
        autoComplete="address-line2"
        label={
          <span className="govuk-visually-hidden">
            Building and street line 2 of 2
          </span>
        }
      />
      <Input
        name="address.town"
        autoComplete="address-level2"
        label={'Town or city'}
        className={'govuk-!-width-two-thirds'}
      />

      <Input
        name="address.county"
        label={'County'}
        className={'govuk-!-width-two-thirds'}
      />

      <Input
        name="postcode"
        autoComplete="postal-code"
        label={'Postcode'}
        className={'govuk-input--width-10'}
      />
    </fieldset>
  );
}

function Summary({
  addressHistory,
}: {
  addressHistory: AddressHistoryEntry[];
}) {
  const durations = calculateDurations(addressHistory);
  return (
    <>
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
            </div>

            <Label content={'Address'} strong />
            <Paragraph>
              {[
                entry.address.line1,
                entry.address.line2,
                entry.address.line3,
                entry.address.line4,
                entry.address.town,
                entry.address.county,
                entry.postcode,
              ]
                .filter((v) => !!v)
                .map((v) => (
                  <>
                    {v}
                    <br />
                  </>
                ))}
            </Paragraph>

            <Label content={'Time at address'} strong />
            <Paragraph>{durations[i].label}</Paragraph>
          </InsetText>
        </>
      ))}
    </>
  );
}

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
    date: '',
    dateTo: '',
    uprn: '',
    address: {
      line1: '',
      line2: '',
      town: '',
      county: '',
    },
  };
  type Values = typeof initialValues;

  const savedAddressHistory = getQuestionValue(
    applicant.questions,
    FormID.ADDRESS_HISTORY,
    'addressHistory'
  );
  const [state, setState] = useState<State>(
    savedAddressHistory ? 'review' : 'postcode-entry'
  );

  const [postcodeResults, setPostcodeResults] = useState<
    AddressLookupAddress[]
  >([]);

  const [addressHistory, setAddressHistory] = useState<AddressHistoryEntry[]>(
    savedAddressHistory ?? []
  );

  const restart = () => {
    setAddressHistory([]);
    setState('postcode-entry');
  };

  const onSubmit = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => {
    function appendAddress(address: AddressHistoryEntry) {
      const newHistory = [...addressHistory, address];
      setAddressHistory(newHistory);
      formikHelpers.resetForm();
      if (checkAddressHistory(newHistory, REQUIRED_YEARS)) {
        setState('review');
      } else {
        setState('postcode-entry');
      }
    }

    switch (state) {
      case 'postcode-entry':
        {
          try {
            const r = await lookUpAddress(values.postcode);
            setPostcodeResults(r.address);
            formikHelpers.setValues({
              ...values,
              uprn: r.address[0]?.UPRN.toString(),
            });
            setState('choose-address');
          } catch (e) {
            console.error(e);
            setState('manual-entry');
          }
        }
        break;

      case 'manual-entry': {
        appendAddress({
          postcode: values.postcode,
          date: values.date,
          dateTo: values.dateTo,
          address: values.address,
        });
        break;
      }

      case 'choose-address': {
        appendAddress({
          postcode: values.postcode,
          date: values.date,
          dateTo: values.dateTo,
          address: postcodeResults.find(
            (r) => r.UPRN.toString() === values.uprn
          )!,
        });
        break;
      }

      case 'review': {
        const [currentAddress] = addressHistory;
        dispatch(
          updateApplicant({
            person: { id: applicant.person.id },
            address: {
              addressLine1: currentAddress.address.line1,
              addressLine2: currentAddress.address.line2,
              addressLine3:
                currentAddress.address.line3 ?? currentAddress.address.town,
              postcode:
                currentAddress.address.postcode ?? currentAddress.postcode,
              addressType: AddressType.MainAddress,
            },
          })
        );
        dispatch(
          updateWithFormValues({
            personID: applicant.person.id,
            formID: FormID.ADDRESS_HISTORY,
            values: { addressHistory },
            markAsComplete: true,
          })
        );
        router.push(`/apply/${resident}`);
        break;
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
        street, contact a{' '}
        <a href="https://hackney.gov.uk/housing-options">housing officer</a>
      </Details>

      <Summary addressHistory={addressHistory} />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={generateValidationSchema(state, addressHistory)}
      >
        {({ isSubmitting, values }) => (
          <Form>
            {state === 'postcode-entry' && (
              <>
                {addressHistory.length > 0 && (
                  <h2 className="lbh-heading-h2">Previous address</h2>
                )}
                <Input
                  name="postcode"
                  label="Postcode"
                  autoComplete="postal-code"
                />
                <Button type="submit">Find address</Button>
              </>
            )}

            {state === 'manual-entry' && (
              <InsetText>
                <ManualEntry />
                <DateInput
                  name={'date'}
                  label={'When did you move to this address?'}
                  showDay={false}
                />
                {addressHistory.length > 0 && (
                  <DateInput
                    name={'dateTo'}
                    label={'When did you leave this address?'}
                    showDay={false}
                  />
                )}
              </InsetText>
            )}

            {state === 'choose-address' && (
              <InsetText>
                <Label content={'Postcode'} strong />

                <div>
                  {values.postcode}
                  &nbsp;&nbsp;&nbsp;
                  <a
                    role="button"
                    href="#"
                    className="lbh-link lbh-link--no-visited-state"
                    onClick={() => {
                      setState('postcode-entry');
                    }}
                  >
                    Change
                  </a>
                </div>

                <Select
                  label={'Select an address'}
                  name={'uprn'}
                  options={postcodeResults.map((address) => ({
                    label: address.line1 + ', ' + address.town,
                    value: address.UPRN.toString(),
                  }))}
                />

                <a
                  role="button"
                  href="#"
                  className="lbh-link lbh-link--no-visited-state"
                  onClick={() => setState('manual-entry')}
                >
                  I can't find my address in the list
                </a>
                <DateInput
                  name={'date'}
                  label={'When did you move to this address?'}
                  showDay={false}
                />
                {addressHistory.length > 0 && (
                  <DateInput
                    name={'dateTo'}
                    label={'When did you leave this address?'}
                    showDay={false}
                  />
                )}
              </InsetText>
            )}

            <div className="c-flex lbh-simple-pagination">
              {state === 'review' && (
                <div className="c-flex__1">
                  <Button onClick={restart} secondary={true}>
                    Update address
                  </Button>
                </div>
              )}

              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  Save and continue
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </ApplicantStep>
  );
};

export default ApplicationStep;
