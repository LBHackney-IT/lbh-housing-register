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

interface PageProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  maximumAddresses?: number;
}

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
};

export default function AddCaseAddress({
  addresses,
  setAddresses,
  maximumAddresses = 0,
}: PageProps): JSX.Element {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState({
    address: emptyAddress as Address,
    isEditing: false,
  });
  const [editAddressIndex, setEditAddressIndex] = useState(0);

  const addAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAddressInDialog({
      address: emptyAddress,
      isEditing: false,
    });
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setAddressInDialog({
      address: addresses[addressIndex],
      isEditing: true,
    });
    setEditAddressIndex(addressIndex);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (addressInDialog.isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = addressInDialog.address;
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, addressInDialog.address]);
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
            {addresses.map((address, index) => (
              <FormGroup key={index}>
                {index === 0 ? (
                  <HeadingThree content="Current address" />
                ) : null}
                {index === 1 ? (
                  <HeadingThree content="Previous addresses" />
                ) : null}
                <Paragraph>
                  {address.addressLine1 && (
                    <>
                      {address.addressLine1}
                      <br />
                    </>
                  )}
                  {address.addressLine2 && (
                    <>
                      {address.addressLine2}
                      <br />
                    </>
                  )}
                  {address.addressLine3 && (
                    <>
                      {address.addressLine3}
                      <br />
                    </>
                  )}
                  {address.addressLine4 && (
                    <>
                      {address.addressLine4}
                      <br />
                    </>
                  )}
                  {address.postcode && (
                    <>
                      {address.postcode}
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
            <label className="govuk-label lbh-label" htmlFor="addressLine1">
              Building and street
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-line1"
              name="addressLine1"
              value={addressInDialog.address.addressLine1}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="addressLine2">
              Building and street line 2
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-line2"
              name="addressLine2"
              value={addressInDialog.address.addressLine2}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="addressLine3">
              Town or city
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              autoComplete="address-level2"
              name="addressLine3"
              value={addressInDialog.address.addressLine3}
              onChange={handleAddressChange}
            />
          </FormGroup>

          <FormGroup>
            <label className="govuk-label lbh-label" htmlFor="addressLine4">
              County
            </label>
            <input
              className="govuk-input lbh-input govuk-!-width-two-thirds"
              name="addressLine4"
              value={addressInDialog.address.addressLine4}
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

          <Button onClick={saveAddress}>Save address</Button>
        </>
      </Dialog>
    </>
  );
}
