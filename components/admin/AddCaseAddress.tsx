import { useState, useEffect } from 'react';

import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../summary-list';
import FormGroup from '../form/form-group';
import Dialog from 'lbh-frontend/dialog';
import Paragraph from '../content/paragraph';
import { HeadingThree, HeadingFour } from '../content/headings';
import Button from '../button';
import ErrorMessage from '../form/error-message';
import { Address } from '../../lib/utils/adminHelpers';

interface PageProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  maximumAddresses?: number;
  error?: string;
}

const emptyAddress = {
  address: {
    line1: '',
    line2: '',
    town: '',
    county: '',
    postcode: '',
  },
  date: '',
  dateTo: '',
};

const emptyDate = {
  dateMonth: '',
  dateYear: '',
  dateToMonth: '',
  dateToYear: '',
};

const dateFieldNames = [
  'dateMonth',
  'dateYear',
  'dateToMonth',
  'dateToYear',
] as const;

type DateFieldName = (typeof dateFieldNames)[number];

const isDateFieldName = (name: string): name is DateFieldName =>
  (dateFieldNames as readonly string[]).includes(name);

type DatePairResult =
  | { ok: true; iso: string }
  | { ok: false; reason: 'empty' | 'partial' | 'invalid' };

export const parseMonthYear = (year: string, month: string): DatePairResult => {
  const hasYear = year.trim() !== '';
  const hasMonth = month.trim() !== '';

  if (!hasYear && !hasMonth) {
    return { ok: false, reason: 'empty' };
  }

  if (hasYear !== hasMonth) {
    return { ok: false, reason: 'partial' };
  }

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const parsed = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));

  if (
    Number.isNaN(+parsed) ||
    parsed.getUTCFullYear() !== yearNumber ||
    parsed.getUTCMonth() !== monthNumber - 1
  ) {
    return { ok: false, reason: 'invalid' };
  }

  return { ok: true, iso: parsed.toISOString() };
};

export const firstOfMonthIso = (year: string, month: string): string => {
  const parsed = parseMonthYear(year, month);
  return parsed.ok ? parsed.iso : '';
};

const currentMonthIso = (now = new Date()): string =>
  new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();

const datePairMessage = (
  from: DatePairResult,
  to: DatePairResult,
): string | undefined => {
  if (
    (!from.ok && from.reason === 'invalid') ||
    (!to.ok && to.reason === 'invalid')
  ) {
    return 'Invalid date';
  }
  if (
    (!from.ok && from.reason === 'partial') ||
    (!to.ok && to.reason === 'partial')
  ) {
    return 'Enter a month and year';
  }
  if (from.ok && to.ok && from.iso > to.iso) {
    return 'The end date must be after the start date';
  }
  if (to.ok && to.iso > currentMonthIso()) {
    return 'The end date must not be in the future';
  }
};

export default function AddCaseAddress({
  addresses,
  setAddresses,
  maximumAddresses = 0,
  error,
}: PageProps): JSX.Element {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState(emptyAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [date, setDate] = useState(emptyDate);
  const [dateError, setDateError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAddressInDialog((current) => ({
      ...current,
      date: firstOfMonthIso(date.dateYear, date.dateMonth),
      dateTo: firstOfMonthIso(date.dateToYear, date.dateToMonth),
    }));
  }, [date]);

  const addNewAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEditing(false);
    setAddressInDialog(emptyAddress);
    setDate(emptyDate);
    setDateError(undefined);
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setIsEditing(true);
    setAddressInDialog(addresses[addressIndex]);
    const { date: from = '', dateTo: to = '' } = addresses[addressIndex];
    setDate({
      dateMonth: from.split('-')[1] || '',
      dateYear: from.split('-')[0] || '',
      dateToMonth: to.split('-')[1] || '',
      dateToYear: to.split('-')[0] || '',
    });
    setEditAddressIndex(addressIndex);
    setDateError(undefined);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    const from = parseMonthYear(date.dateYear, date.dateMonth);
    const to = parseMonthYear(date.dateToYear, date.dateToMonth);
    const message = datePairMessage(from, to);

    if (message) {
      setDateError(message);
      return;
    }

    const toSave = {
      ...addressInDialog,
      date: from.ok ? from.iso : '',
      dateTo: to.ok ? to.iso : '',
    };

    if (isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = toSave;
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, toSave]);
    }

    setAddressDialogOpen(false);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (isDateFieldName(name)) {
      setDate((current) => ({ ...current, [name]: value }));
      setDateError(undefined);
      return;
    }

    setAddressInDialog((current) => ({
      ...current,
      address: {
        ...current.address,
        [name]: value,
      },
    }));
  };

  const deleteAddress = (addressIndex: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(addressIndex, 1);
    setAddresses(newAddresses);
  };

  const formatIsoDate = (date: string) => {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleString('en-GB', {
      month: 'long',
    })} ${dateObj.getFullYear()}`;
  };

  return (
    <>
      <div id="addressHistory">
        <SummaryListNoBorder>
          <SummaryListRow>
            <SummaryListKey>Address history</SummaryListKey>
            <SummaryListValue>
              <label htmlFor="addressHistory_addressFinder">
                Address history
              </label>
            </SummaryListValue>
            <SummaryListActions wideActions={true}>
              {addresses
                ? addresses.map((addressItem, index) => (
                    <FormGroup key={index}>
                      {index === 0 ? (
                        <HeadingThree content="Current address" />
                      ) : null}
                      {index === 1 ? (
                        <HeadingThree content="Previous addresses" />
                      ) : null}
                      <p className="lbh-body-s">
                        {addressItem.address.line1 && (
                          <>
                            {addressItem.address.line1}
                            <br />
                          </>
                        )}
                        {addressItem.address.line2 && (
                          <>
                            {addressItem.address.line2}
                            <br />
                          </>
                        )}
                        {addressItem.address.town && (
                          <>
                            {addressItem.address.town}
                            <br />
                          </>
                        )}
                        {addressItem.address.county && (
                          <>
                            {addressItem.address.county}
                            <br />
                          </>
                        )}
                        {addressItem.address.postcode && (
                          <>
                            {addressItem.address.postcode}
                            <br />
                          </>
                        )}
                      </p>

                      {addressItem.date && addressItem.dateTo && (
                        <p className="lbh-body-s lbh-!-margin-top-1">
                          {`${formatIsoDate(addressItem.date)} to ${formatIsoDate(
                            addressItem.dateTo,
                          )}`}
                        </p>
                      )}

                      <p className="lbh-!-margin-top-1">
                        <a
                          className="lbh-link lbh-link--no-visited-state"
                          href="#edit"
                          onClick={() => editAddress(index)}
                        >
                          Edit
                        </a>
                        {' | '}
                        <a
                          className="lbh-link lbh-link--no-visited-state"
                          href="#delete"
                          onClick={() => deleteAddress(index)}
                        >
                          Delete
                        </a>
                      </p>
                    </FormGroup>
                  ))
                : null}

              {maximumAddresses === 0 || addresses.length < maximumAddresses ? (
                <FormGroup error={!!error}>
                  {error ? <ErrorMessage message={error} /> : null}
                  <button
                    className={`govuk-button lbh-button govuk-secondary lbh-button--secondary ${
                      addresses.length === 0
                        ? 'lbh-!-margin-top-0 '
                        : 'govuk-secondary lbh-button--secondary'
                    }${error ? ' govuk-input--error' : ''}`}
                    onClick={addNewAddress}
                    data-testid="test-add-case-address-button"
                  >
                    Add address
                  </button>
                </FormGroup>
              ) : null}
            </SummaryListActions>
          </SummaryListRow>
        </SummaryListNoBorder>
      </div>

      <Dialog
        isOpen={addressDialogOpen}
        title={`${isEditing ? 'Edit' : 'Add'} address`}
        onDismiss={() => setAddressDialogOpen(false)}
        onCancel={() => setAddressDialogOpen(false)}
        cancelText="Close"
      >
        <>
          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="line1">
              Building and street
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-line1"
              name="line1"
              value={addressInDialog.address.line1}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="line2">
              Building and street line 2
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-line2"
              name="line2"
              value={addressInDialog.address.line2}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="town">
              Town or city
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-level2"
              name="town"
              value={addressInDialog.address.town}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="county">
              County
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              name="county"
              value={addressInDialog.address.county}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="postcode">
              Postcode
            </label>
            <input
              className="govuk-input lbh-input govuk-input--width-10"
              autoComplete="postal-code"
              name="postcode"
              value={addressInDialog.address.postcode}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <HeadingFour content="Dates at address" />
          {dateError ? <ErrorMessage message={dateError} /> : null}

          <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor="dateMonth"
            >
              Month
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              type="text"
              pattern="[0-9]{1,2}"
              inputMode="numeric"
              name="dateMonth"
              onChange={handleAddressChange}
              value={date.dateMonth}
            />
          </div>
          <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor="dateYear"
            >
              Year
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-4"
              type="text"
              pattern="[0-9]{4}"
              inputMode="numeric"
              name="dateYear"
              onChange={handleAddressChange}
              value={date.dateYear}
            />
          </div>

          <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
            <Paragraph>to</Paragraph>
          </div>

          <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor="dateToMonth"
            >
              Month
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              type="text"
              pattern="[0-9]{1,2}"
              inputMode="numeric"
              name="dateToMonth"
              onChange={handleAddressChange}
              value={date.dateToMonth}
            />
          </div>
          <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor="dateToYear"
            >
              Year
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-4"
              type="text"
              pattern="[0-9]{4}"
              inputMode="numeric"
              name="dateToYear"
              onChange={handleAddressChange}
              value={date.dateToYear}
            />
          </div>

          <Button
            dataTestId="test-save-case-address-button"
            onClick={saveAddress}
          >
            Save address
          </Button>
        </>
      </Dialog>
    </>
  );
}
