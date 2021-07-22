export default function ShowAddress({
  currentAddress,
  duration,
}: any): JSX.Element {
  const addressSplit = currentAddress.split(',');
  return (
    <div className="lbh-body-m">
      {addressSplit[0]}
      <br />
      {addressSplit[1]}
      <br />
      {addressSplit[2]}
      <div>
        <strong>Time at Address</strong>
        <br />
        {duration[0].years} years, {duration[1].months} months
      </div>
    </div>
  );
}
