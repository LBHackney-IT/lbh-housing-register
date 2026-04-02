import type { ChangeEventHandler } from 'react';

interface AddressOption {
  line1: string;
  town: string;
  postcode: string;
  UPRN: string;
}

interface AddressSelectorProps {
  addresses: AddressOption[];
  addressSelectorHandler: ChangeEventHandler<HTMLSelectElement>;
}

export default function AddressSelector({
  addresses,
  addressSelectorHandler,
}: AddressSelectorProps): JSX.Element {
  return (
    <div className="govuk-form-group lbh-form-group">
      <label className="govuk-label lbh-label" htmlFor="select-1">
        <strong>Select Address</strong>
      </label>
      <select
        className="govuk-select lbh-select"
        id="select-1"
        name="select-1"
        onChange={addressSelectorHandler}
      >
        {addresses.map((address: AddressOption) => {
          return (
            <option
              value={[address.line1, address.town, address.postcode]}
              key={address.UPRN}
            >
              {address.line1 + ',' + address.town + '' + address.postcode}
            </option>
          );
        })}
      </select>
    </div>
  );
}
