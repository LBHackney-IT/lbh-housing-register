export default function ShowAddress({currentAddress}: any): JSX.Element {
  const addressSplit = currentAddress.split(',');
  return (
    <div className="lbh-body-m" >
      {addressSplit[0]}
      <br />
      {addressSplit[1]}
      <br />
      {addressSplit[2]}
    </div>
  );
}