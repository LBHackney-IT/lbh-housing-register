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
  addressDialogOpen: boolean;
  addressInDialog: {
    address: Address;
    isEditing: boolean;
  };
  addAddress: (event: React.MouseEvent<HTMLButtonElement>) => void;
  editAddress: (addressIndex: number) => void;
  deleteAddress: (addressIndex: number) => void;
  setAddressDialogOpen: (open: boolean) => void;
  handleAddressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  saveAddress: () => void;
}

export default function AddCaseAddAddress({
  addresses,
  addressDialogOpen,
  addressInDialog,
  addAddress,
  editAddress,
  deleteAddress,
  setAddressDialogOpen,
  handleAddressChange,
  saveAddress,
}: PageProps): JSX.Element {
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
                  {address.addressLine1}
                  <br />
                  {address.addressLine2 ? (
                    <>
                      address.addressLine2
                      <br />
                    </>
                  ) : null}

                  {address.addressLine3}
                  <br />
                  {address.addressLine4}
                  <br />
                  {address.postcode}
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
