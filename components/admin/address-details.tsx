import { Address } from '../../domain/HousingApi';
import Collapsible from '../collapsible';

interface SummaryProps {
  heading: string;
  address: Address;
}

export default function AddressDetails({
  heading,
  address,
}: SummaryProps): JSX.Element {
  return (
    <Collapsible heading={heading}>
      <dl className="govuk-summary-list lbh-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Address</dt>
          <dd className="govuk-summary-list__value">
            <p className="govuk-body">
              {address.addressLine1}
              <br />
              {address.addressLine2}
              <br />
              {address.addressLine3}
              <br />
              {address.postcode}
            </p>
          </dd>
          <span className="govuk-summary-list__actions" />
        </div>
      </dl>
    </Collapsible>
  );
}
