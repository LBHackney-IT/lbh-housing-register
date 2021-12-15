import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../summary-list';
import Select from '../form/select';
import { relationshipOptions } from '../application/add-person-form';

export default function AddRelationshipType(): JSX.Element {
  return (
    <>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListKey>{''}</SummaryListKey>
          <SummaryListValue>
            <label htmlFor="addressHistory_addressFinder">
              Relationship to main applicant
            </label>
          </SummaryListValue>
          <SummaryListActions wideActions={true}>
            <Select
              modifierClasses="lbh-select--full-width"
              label={''}
              name={'personalDetails_relationshipType'}
              options={relationshipOptions.map((relationshipType) => ({
                label: relationshipType.label,
                value: relationshipType.value,
              }))}
            />
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
    </>
  );
}
