import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import ApplicantStep from '../../../components/application/ApplicantStep';
import Button from '../../../components/button';
import { HeadingOne } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import InsetText from '../../../components/content/inset-text';
import Details from '../../../components/details';
import DateInput, { INVALID_DATE } from '../../../components/form/dateinput';
import Input from '../../../components/form/input';
import Label from '../../../components/form/label';
import Select from '../../../components/form/select';
import { AddressLookupAddress } from '../../../domain/addressLookup';
import { Applicant, AddressType } from '../../../domain/HousingApi';
import Layout from '../../../components/layout/resident-layout';
import { lookUpAddress } from '../../../lib/gateways/internal-api';
import withApplication from '../../../lib/hoc/withApplication';
import { selectApplicationLoadStatus } from '../../../lib/store/application-load';
import {
  applicantHasId,
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
import {
  formatPostcode,
  isUkPostcode,
  UK_POSTCODE_ERROR,
} from '../../../lib/utils/postcode';
import Custom404 from '../../404';
import useApiCallStatus from 'lib/hooks/useApiCallStatus';
import {
  ApiCallStatusCode,
  selectSaveApplicationStatus,
} from 'lib/store/apiCallsStatus';
import { scrollToError } from 'lib/utils/scroll';
import Loading from 'components/loading';
import ErrorSummary from 'components/errors/error-summary';

type State = 'postcode-entry' | 'manual-entry' | 'choose-address' | 'review';

const POSTCODE_NOT_FOUND =
  'We could not find any addresses for that postcode. Enter a known postcode, or enter the address manually.';

const POSTCODE_LOOKUP_FAILED =
  'We could not look up that postcode. Enter a known postcode, or enter the address manually.';

function createBlankAddressForm() {
  return {
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
}

type AddressFormValues = ReturnType<typeof createBlankAddressForm>;

function addressLabel(index: number): string {
  if (index === 0) {
    return 'current address';
  }
  if (index === 1) {
    return 'previous address';
  }
  return `previous address ${index}`;
}

function dateBounds(
  addressHistory: AddressHistoryEntry[],
  editingIndex: number | null,
) {
  const newerAddresses = addressHistory.slice(
    0,
    editingIndex ?? addressHistory.length,
  );
  const latest = Math.min(
    +new Date(),
    ...newerAddresses.map((entry) => +new Date(entry.date)),
  );
  const olderAddress =
    editingIndex === null ? undefined : addressHistory[editingIndex + 1];
  const earliest = olderAddress?.dateTo
    ? +new Date(olderAddress.dateTo)
    : undefined;
  return { latest, earliest };
}

function isDateValue(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value !== '' &&
    value !== INVALID_DATE &&
    !isNaN(+new Date(value))
  );
}

function trimToRequiredHistory(
  addressHistory: AddressHistoryEntry[],
  requiredYears: number,
) {
  const lastNeeded = addressHistory.findIndex((_, index) =>
    checkAddressHistory(addressHistory.slice(0, index + 1), requiredYears),
  );
  return lastNeeded === -1
    ? addressHistory
    : addressHistory.slice(0, lastNeeded + 1);
}

function requiresLeaveDate(
  addressHistory: AddressHistoryEntry[],
  editingIndex: number | null,
) {
  if (editingIndex === null) {
    return addressHistory.length > 0;
  }
  return editingIndex > 0;
}

function generateValidationSchema(
  state: State,
  addressHistory: AddressHistoryEntry[],
  editingIndex: number | null,
) {
  const { latest, earliest } = dateBounds(addressHistory, editingIndex);
  const countyRequired =
    editingIndex === null ||
    Boolean(addressHistory[editingIndex]?.address.county?.trim());

  const schema = Yup.object({
    date: Yup.string()
      .notOneOf([INVALID_DATE], 'Invalid date')
      .label('When did you move to this address')
      .required()
      .test(
        'min',
        '${path} must be ' + formatDate(new Date(latest)) + ' or before',
        (value) => isDateValue(value) && +new Date(value) <= latest,
      )
      .test(
        'after-older-address',
        '${path} must be ' +
          (earliest === undefined ? '' : formatDate(new Date(earliest))) +
          ' or after, when you left your previous address',
        (value) =>
          earliest === undefined ||
          (isDateValue(value) && +new Date(value) >= earliest),
      ),
    dateTo: Yup.string()
      .notOneOf([INVALID_DATE], 'Invalid date')
      .label('When did you leave this address')
      .required()
      .test(
        'min',
        '${path} must be ' + formatDate(new Date(latest)) + ' or before',
        (value) => isDateValue(value) && +new Date(value) <= latest,
      )
      .test(
        'after-move-in',
        '${path} must be the same as or after when you moved to this address',
        function (value) {
          const movedIn = this.parent.date;
          if (!isDateValue(value) || !isDateValue(movedIn)) {
            return true;
          }
          return +new Date(value) >= +new Date(movedIn);
        },
      ),
    postcode: Yup.string()
      .label('Postcode')
      .required()
      .test('uk-postcode', UK_POSTCODE_ERROR, (value) => {
        if (!value) {
          return true;
        }
        return isUkPostcode(value);
      }),
    uprn: Yup.string().label('Address').required(),
    address: Yup.object({
      line1: Yup.string().label('Building and street').required(),
      line2: Yup.string(),
      town: Yup.string().label('Town or city').required(),
      county: countyRequired
        ? Yup.string().label('County').required()
        : Yup.string().label('County'),
    }),
  });

  const showLeaveDate = requiresLeaveDate(addressHistory, editingIndex);

  switch (state) {
    case 'postcode-entry':
      return schema.pick(['postcode']);
    case 'manual-entry':
      return showLeaveDate
        ? schema.pick(['address', 'date', 'dateTo'])
        : schema.pick(['address', 'date']);
    case 'choose-address':
      return showLeaveDate
        ? schema.pick(['uprn', 'date', 'dateTo'])
        : schema.pick(['uprn', 'date']);
    case 'review':
      return undefined;
  }
}

function ManualEntry({ countyOptional = false }: { countyOptional?: boolean }) {
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
        label={countyOptional ? 'County (optional)' : 'County'}
        className={'govuk-!-width-two-thirds'}
      />

      <Input
        name="postcode"
        autoComplete="postal-code"
        label={'Postcode (optional)'}
        className={'govuk-input--width-10'}
      />
    </fieldset>
  );
}

function sameText(left?: string, right?: string) {
  return (left ?? '') === (right ?? '');
}

function valuesFromEntry(entry: AddressHistoryEntry): AddressFormValues {
  return {
    postcode: entry.postcode || entry.address.postcode || '',
    date: entry.date,
    dateTo: entry.dateTo || '',
    uprn: entry.address.UPRN?.toString() ?? '',
    address: {
      line1: entry.address.line1 ?? '',
      line2: entry.address.line2 ?? '',
      town: entry.address.town ?? '',
      county: entry.address.county ?? '',
    },
  };
}

function entryFromManualValues(
  values: AddressFormValues,
  existing?: AddressHistoryEntry,
): AddressHistoryEntry {
  if (!existing) {
    return {
      postcode: values.postcode,
      date: values.date,
      dateTo: values.dateTo,
      address: values.address,
    };
  }

  const unchanged =
    sameText(existing.postcode || existing.address.postcode, values.postcode) &&
    sameText(existing.address.line1, values.address.line1) &&
    sameText(existing.address.line2, values.address.line2) &&
    sameText(existing.address.town, values.address.town) &&
    sameText(existing.address.county, values.address.county);

  if (unchanged) {
    return {
      ...existing,
      postcode: values.postcode,
      date: values.date,
      dateTo: values.dateTo,
    };
  }

  const addressWithoutUprn = Object.fromEntries(
    Object.entries(existing.address).filter(([key]) => key !== 'UPRN'),
  ) as AddressHistoryEntry['address'];

  return {
    postcode: values.postcode,
    date: values.date,
    dateTo: values.dateTo,
    address: {
      ...addressWithoutUprn,
      line1: values.address.line1,
      line2: values.address.line2,
      town: values.address.town,
      county: values.address.county,
      postcode: values.postcode || undefined,
    },
  };
}

function addressLines(entry: AddressHistoryEntry): string[] {
  return [
    entry.address.line1,
    entry.address.line2,
    entry.address.line3,
    entry.address.line4,
    entry.address.town,
    entry.address.county,
    entry.postcode && formatPostcode(entry.postcode),
  ].filter((line): line is string => !!line);
}

function Summary({
  addressHistory,
  start,
  end,
  editingIndex,
  onChangeAddress,
  onRemoveAddress,
}: {
  addressHistory: AddressHistoryEntry[];
  start: number;
  end: number;
  editingIndex: number | null;
  onChangeAddress: (index: number) => void;
  onRemoveAddress: (index: number) => void;
}) {
  const durations = calculateDurations(addressHistory);
  const showActions = editingIndex === null;
  return (
    <>
      {addressHistory.slice(start, end).map((entry, offset) => {
        const index = start + offset;
        return (
          <React.Fragment key={index}>
            {index === 1 && (
              <h2 className="lbh-heading-h2">Previous address</h2>
            )}
            {index > 1 && (
              <h2 className="lbh-heading-h2">Previous address {index}</h2>
            )}
            {index !== editingIndex && (
              <InsetText>
                <Label content={'Address'} strong />
                <Paragraph>
                  {addressLines(entry).map((line, lineIndex) => (
                    <span key={lineIndex} className="lbh-address__line">
                      {line}
                    </span>
                  ))}
                </Paragraph>

                <Label content={'Time at address'} strong />
                <Paragraph>{durations[index].label}</Paragraph>
                {showActions && (
                  <p className="lbh-body lbh-address__actions">
                    <button
                      type="button"
                      className="lbh-link lbh-link--no-visited-state"
                      onClick={() => onChangeAddress(index)}
                    >
                      Change
                      <span className="govuk-visually-hidden">
                        {' '}
                        {addressLabel(index)}
                      </span>
                    </button>
                    {/* The current address can only be removed once it is the
                      only one left, so the history always starts from now. */}
                    {(index > 0 || addressHistory.length === 1) && (
                      <button
                        type="button"
                        className="lbh-link lbh-link--no-visited-state"
                        onClick={() => onRemoveAddress(index)}
                      >
                        Remove
                        <span className="govuk-visually-hidden">
                          {' '}
                          {addressLabel(index)}
                        </span>
                      </button>
                    )}
                  </p>
                )}
              </InsetText>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident } = router.query as { resident: string };
  const applicant = useAppSelector(selectApplicant(resident)) as Applicant;
  const dispatch = useAppDispatch();

  const application = useAppSelector((store) => store.application);
  const isMainResidentOrPartner =
    applicant === application.mainApplicant ||
    applicant?.person?.relationshipType === 'partner';

  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [userError, setUserError] = useState<string | null>(null);

  useApiCallStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSaved,
    setUserError,
    scrollToError,
    pathToPush: `/apply/${resident}`,
  });

  const loadStatus = useAppSelector(selectApplicationLoadStatus);

  const requiredYears = isMainResidentOrPartner ? 5 : 0;

  const savedAddressHistory = applicant
    ? getQuestionValue(
        applicant.questions,
        FormID.ADDRESS_HISTORY,
        'addressHistory',
      )
    : undefined;
  const [state, setState] = useState<State>(
    savedAddressHistory ? 'review' : 'postcode-entry',
  );

  const [postcodeResults, setPostcodeResults] = useState<
    AddressLookupAddress[]
  >([]);
  const [postcodeLookupError, setPostcodeLookupError] = useState<string | null>(
    null,
  );

  const [addressHistory, setAddressHistory] = useState<AddressHistoryEntry[]>(
    savedAddressHistory ?? [],
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formValues, setFormValues] = useState(createBlankAddressForm);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (editingIndex === null) {
      return;
    }
    document.getElementById('address.line1')?.focus({ preventScroll: true });
  }, [editingIndex, formKey]);

  const showLeaveDate = requiresLeaveDate(addressHistory, editingIndex);
  const countyOptional =
    editingIndex !== null &&
    !addressHistory[editingIndex]?.address.county?.trim();

  const beginEdit = (index: number) => {
    const entry = addressHistory[index];
    if (!entry || index === editingIndex) {
      return;
    }
    setEditingIndex(index);
    setPostcodeLookupError(null);
    setPostcodeResults([]);
    setFormValues(valuesFromEntry(entry));
    setFormKey((key) => key + 1);
    setState('manual-entry');
  };

  const leaveEditor = (history: AddressHistoryEntry[]) => {
    setEditingIndex(null);
    setPostcodeLookupError(null);
    setPostcodeResults([]);
    setFormValues(createBlankAddressForm());
    setFormKey((key) => key + 1);
    setState(
      history.length > 0 && checkAddressHistory(history, requiredYears)
        ? 'review'
        : 'postcode-entry',
    );
  };

  const removeAddress = (index: number) => {
    const newHistory = addressHistory.filter((_, i) => i !== index);
    setAddressHistory(newHistory);
    if (state === 'review') {
      leaveEditor(newHistory);
    }
  };

  const onSubmit = async (
    values: AddressFormValues,
    formikHelpers: FormikHelpers<AddressFormValues>,
  ) => {
    function commitAddress(address: AddressHistoryEntry) {
      const newHistory = trimToRequiredHistory(
        editingIndex === null
          ? [...addressHistory, address]
          : addressHistory.map((entry, index) =>
              index === editingIndex ? address : entry,
            ),
        requiredYears,
      );
      setAddressHistory(newHistory);
      leaveEditor(newHistory);
    }

    switch (state) {
      case 'postcode-entry':
        setPostcodeLookupError(null);
        try {
          const r = await lookUpAddress(values.postcode);
          const addresses = r.address ?? [];
          if (addresses.length === 0) {
            setPostcodeLookupError(POSTCODE_NOT_FOUND);
            break;
          }
          setPostcodeResults(addresses);
          formikHelpers.setValues({
            ...values,
            uprn: addresses[0].UPRN.toString(),
          });
          // Continue marks every initial value as touched, including the move
          // date. Clear that so choosing an address does not show the date error.
          formikHelpers.setTouched({}, false);
          setState('choose-address');
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.startsWith('Unable to look up address')
          ) {
            setPostcodeLookupError(POSTCODE_LOOKUP_FAILED);
            break;
          }
          throw error;
        }

        break;

      case 'manual-entry': {
        commitAddress(
          entryFromManualValues(
            values,
            editingIndex === null ? undefined : addressHistory[editingIndex],
          ),
        );
        break;
      }

      case 'choose-address': {
        commitAddress({
          postcode: values.postcode,
          date: values.date,
          dateTo: values.dateTo,
          address: postcodeResults.find(
            (r) => r.UPRN.toString() === values.uprn,
          )!,
        });
        break;
      }

      case 'review': {
        const [currentAddress] = addressHistory;
        setHasSaved(true);
        dispatch(
          updateApplicant({
            person: { id: applicant.person?.id || '' },
            address: {
              addressLine1: currentAddress.address.line1,
              addressLine2: currentAddress.address.line2,
              addressLine3:
                currentAddress.address.line3 ?? currentAddress.address.town,
              postcode:
                currentAddress.address.postcode ?? currentAddress.postcode,
              addressType: AddressType.MainAddress,
            },
          }),
        );
        dispatch(
          updateWithFormValues({
            formID: FormID.ADDRESS_HISTORY,
            personID: applicant.person!.id!,
            values: { addressHistory },
            markAsComplete: true,
          }),
        );
        break;
      }
    }
  };

  if (!router.isReady || loadStatus !== 'loaded') {
    return (
      <Layout pageName="Address history">
        <Loading text="Checking information…" />
      </Layout>
    );
  }

  return (
    <>
      {applicantHasId(applicant) ? (
        <ApplicantStep
          applicant={applicant}
          stepName="Address History"
          formID={FormID.ADDRESS_HISTORY}
        >
          {userError && (
            <ErrorSummary dataTestId="test-agree-terms-error-summary">
              {userError}
            </ErrorSummary>
          )}
          {saveApplicationStatus?.callStatus === ApiCallStatusCode.PENDING ? (
            <Loading text="Saving..." />
          ) : (
            <>
              {isMainResidentOrPartner ? (
                <>
                  <HeadingOne content="Address history" />
                  <Paragraph>
                    <strong>
                      Tell us where you have been living for the last five
                      years.
                    </strong>
                  </Paragraph>
                </>
              ) : (
                <HeadingOne content="Address" />
              )}
              <Details summary="Help with your address">
                If you have no fixed abode or if you are sofa surfing, use the
                address where you sleep for the majority of the week. If you are
                living on the street, contact a{' '}
                <a
                  className="lbh-link lbh-link--no-visited-state"
                  href="https://hackney.gov.uk/housing-options"
                >
                  housing officer
                </a>
                {/*
                 */}
                .
              </Details>
              <h2 className="lbh-heading-h2">Current address</h2>

              <Summary
                addressHistory={addressHistory}
                start={0}
                end={
                  editingIndex === null
                    ? addressHistory.length
                    : editingIndex + 1
                }
                editingIndex={editingIndex}
                onChangeAddress={beginEdit}
                onRemoveAddress={removeAddress}
              />
              <Formik
                key={formKey}
                initialValues={formValues}
                onSubmit={onSubmit}
                validationSchema={generateValidationSchema(
                  state,
                  addressHistory,
                  editingIndex,
                )}
              >
                {({ isSubmitting, values }) => (
                  <Form>
                    {state === 'postcode-entry' && (
                      <>
                        {editingIndex === null && addressHistory.length > 0 && (
                          <h2 className="lbh-heading-h2">Previous address</h2>
                        )}
                        <Input
                          name="postcode"
                          label="Postcode"
                          autoComplete="postal-code"
                          error={postcodeLookupError ?? undefined}
                        />
                        <p className="lbh-body">
                          <button
                            type="button"
                            className="lbh-link lbh-link--no-visited-state"
                            onClick={() => {
                              setPostcodeLookupError(null);
                              setState('manual-entry');
                            }}
                          >
                            Enter your address manually
                          </button>
                        </p>
                        <Button
                          type="submit"
                          dataTestId="test-apply-resident-address-history-find-address-button"
                        >
                          Find address
                        </Button>
                      </>
                    )}

                    {state === 'manual-entry' && (
                      <InsetText>
                        <ManualEntry countyOptional={countyOptional} />
                        <DateInput
                          name={'date'}
                          label={'When did you move to this address?'}
                          showDay={false}
                          validateOnSubmitOnly
                        />
                        {showLeaveDate && (
                          <DateInput
                            name={'dateTo'}
                            label={'When did you leave this address?'}
                            showDay={false}
                            validateOnSubmitOnly
                          />
                        )}
                      </InsetText>
                    )}

                    {state === 'choose-address' && (
                      <InsetText>
                        <Label content={'Postcode'} strong />

                        <div>{formatPostcode(values.postcode)}</div>

                        <Select
                          label={'Select an address'}
                          name={'uprn'}
                          options={postcodeResults.map((address) => ({
                            label: address.line1 + ', ' + address.town,
                            value: address.UPRN.toString(),
                          }))}
                        />

                        <button
                          type="button"
                          className="lbh-link lbh-link--no-visited-state"
                          onClick={() => setState('manual-entry')}
                        >
                          I can't find my address in the list
                        </button>
                        <DateInput
                          name={'date'}
                          label={'When did you move to this address?'}
                          showDay={false}
                          validateOnSubmitOnly
                        />
                        {showLeaveDate && (
                          <DateInput
                            name={'dateTo'}
                            label={'When did you leave this address?'}
                            showDay={false}
                            validateOnSubmitOnly
                          />
                        )}
                      </InsetText>
                    )}

                    {state === 'manual-entry' && (
                      <p className="lbh-body">
                        <button
                          type="button"
                          className="lbh-link lbh-link--no-visited-state"
                          onClick={() => {
                            setPostcodeLookupError(null);
                            setState('postcode-entry');
                          }}
                        >
                          Search for an address using a postcode
                        </button>
                      </p>
                    )}

                    {(state !== 'postcode-entry' || editingIndex !== null) && (
                      <div className="c-flex lbh-simple-pagination">
                        {editingIndex !== null && (
                          <div className="c-flex__1">
                            <Button
                              type="button"
                              onClick={() => leaveEditor(addressHistory)}
                              secondary={true}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        {state !== 'postcode-entry' && (
                          <div className="c-flex__1 text-right">
                            <Button
                              disabled={isSubmitting}
                              type="submit"
                              dataTestId="test-apply-resident-address-history-save-and-continue-button"
                            >
                              Save and continue
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
              {editingIndex !== null && (
                <Summary
                  addressHistory={addressHistory}
                  start={editingIndex + 1}
                  end={addressHistory.length}
                  editingIndex={editingIndex}
                  onChangeAddress={beginEdit}
                  onRemoveAddress={removeAddress}
                />
              )}
            </>
          )}
        </ApplicantStep>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

export default withApplication(ApplicationStep);
