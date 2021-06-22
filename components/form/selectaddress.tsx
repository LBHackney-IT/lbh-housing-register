export default function AddressSelector({addresses, addressSelectorHandler}: any): JSX.Element {
  return (
    <div className="govuk-form-group lbh-form-group">
      <select className="govuk-select lbh-select" id="select-1" name="select-1" onChange={addressSelectorHandler}>
        {addresses.map((address:any) => {
          return (
            <option value={[address.line1, address.town, address.postcode]} key={address.UPRN}>{address.line1 + ',' + address.town + '' + address.postcode}</option>
          )
        })}
      </select>
    </div>
  );
}