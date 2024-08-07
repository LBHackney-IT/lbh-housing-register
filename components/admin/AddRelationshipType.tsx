import { relationshipOptions } from '../application/add-person-form';
import Select from '../form/select';
import {
  SummaryListActions,
  SummaryListKey,
  SummaryListNoBorder,
  SummaryListRow,
  SummaryListValue,
} from '../summary-list';

export default function AddRelationshipType(): JSX.Element {
  return (
    <SummaryListNoBorder>
      <SummaryListRow>
        <SummaryListKey />
        <SummaryListValue>
          <label htmlFor="addressHistory_addressFinder">
            Relationship to main applicant
          </label>
        </SummaryListValue>
        <SummaryListActions wideActions>
          <Select
            modifierClasses="lbh-select--full-width"
            label=""
            name="personalDetails_relationshipType"
            options={relationshipOptions.map((relationshipType) => ({
              label: relationshipType.label,
              value: relationshipType.value,
            }))}
          />
        </SummaryListActions>
      </SummaryListRow>
    </SummaryListNoBorder>
  );
}
