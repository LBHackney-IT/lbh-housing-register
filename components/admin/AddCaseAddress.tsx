import { useState } from 'react';
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
import { HeadingThree } from '../content/headings';
import Button from '../button';
import { Address } from '../../lib/utils/adminHelpers';
import DateInput from '../form/dateinput';

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
};

export default function AddCaseAddress({
  addresses,
  setAddresses,
  maximumAddresses = 0,
}: PageProps): JSX.Element {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState({
    address: emptyAddress.address,
    isEditing: false,
  });
  const [editAddressIndex, setEditAddressIndex] = useState(0);

  const addAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAddressInDialog({
      address: emptyAddress.address,
      isEditing: false,
    });
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setAddressInDialog({
      address: addresses[addressIndex].address,
      isEditing: true,
    });
    setEditAddressIndex(addressIndex);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (addressInDialog.isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = { address: addressInDialog.address };
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, { address: addressInDialog.address }]);
    }

    setAddressDialogOpen(false);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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
                onClick={addAddress}
              >
                Add address
              </button>
            ) : null}
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>

      <Dialog
        isOpen={addressDialogOpen}
        title={`${addressInDialog.isEditing ? 'Edit' : 'Add'} address`}
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

          {/* <DateInput label="Date from" name="date" showDay={false} />
          <DateInput label="Date to" name="dateTo" showDay={false} /> */}

          <Button onClick={saveAddress}>Save address</Button>
        </>
      </Dialog>
    </>
  );
}
