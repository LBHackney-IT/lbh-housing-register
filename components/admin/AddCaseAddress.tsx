import { useState, useEffect } from 'react';
import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../summary-list';
import FormGroup from '../form/form-group';
import Dialog from '../dialog';
import Paragraph from '../content/paragraph';
import { HeadingThree, HeadingFour } from '../content/headings';
import Button from '../button';
import { Address } from '../../lib/utils/adminHelpers';

interface PageProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  maximumAddresses?: number;
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

export default function AddCaseAddress({
  addresses,
  setAddresses,
  maximumAddresses = 0,
}: PageProps): JSX.Element {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState(emptyAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [date, setDate] = useState(emptyDate);

  const fromDate = new Date(
    Number(date.dateYear),
    Number(date.dateMonth) - 1,
    1
  );
  const toDate = new Date(
    Number(date.dateToYear),
    Number(date.dateToMonth) - 1,
    1
  );

  useEffect(() => {
    setAddressInDialog({
      ...addressInDialog,
      date: fromDate.toISOString(),
      dateTo: toDate.toISOString(),
    });
  }, [date]);

  const addNewAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEditing(false);
    setAddressInDialog(emptyAddress);
    setDate(emptyDate);
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setIsEditing(true);
    setAddressInDialog(addresses[addressIndex]);
    setEditAddressIndex(addressIndex);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = addressInDialog;
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, addressInDialog]);
    }

    setAddressDialogOpen(false);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDate({
      ...date,
      [name]: value,
    });

    setAddressInDialog({
      ...addressInDialog,
      address: {
        ...addressInDialog.address,
        [name]: value,
      },
    });
  };

  const deleteAddress = (addressIndex: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(addressIndex, 1);
    setAddresses(newAddresses);
  };

  const formatIsoDate = (date: string) => {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleString('default', {
      month: 'long',
    })} ${dateObj.getFullYear()}`;
  };

  return (
    <>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListKey>Address history</SummaryListKey>
          <SummaryListValue>
            <label htmlFor="addressHistory_addressFinder">
              Address history
            </label>
          </SummaryListValue>
          <SummaryListActions wideActions={true}>
            {addresses.map((addressItem, index) => (
              <FormGroup key={index}>
                {index === 0 ? (
                  <HeadingThree content="Current address" />
                ) : null}
                {index === 1 ? (
                  <HeadingThree content="Previous addresses" />
                ) : null}
                <Paragraph>
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
                  {addressItem.date && addressItem.dateTo && (
                    <>
                      {`${formatIsoDate(addressItem.date)} to ${formatIsoDate(
                        addressItem.dateTo
                      )}`}
                    </>
                  )}
                </Paragraph>
                <a
                  className="lbh-link"
                  href="#edit"
                  onClick={() => editAddress(index)}
                >
                  Edit
                </a>{' '}
                <a
                  className="lbh-link"
                  href="#delete"
                  onClick={() => deleteAddress(index)}
                >
                  Delete
                </a>
              </FormGroup>
            ))}

            {maximumAddresses === 0 || addresses.length < maximumAddresses ? (
              <button
                className={`govuk-button lbh-button govuk-secondary lbh-button--secondary ${
                  addresses.length === 0
                    ? 'lbh-!-margin-top-0 '
                    : 'govuk-secondary lbh-button--secondary'
                }`}
                onClick={addNewAddress}
              >
                Add address
              </button>
            ) : null}
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>

      <Dialog
        isOpen={addressDialogOpen}
        title={`${isEditing ? 'Edit' : 'Add'} address`}
        onCancel={() => setAddressDialogOpen(false)}
        onCancelText="Close"
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

          <Button onClick={saveAddress}>Save address</Button>
        </>
      </Dialog>
    </>
  );
}
