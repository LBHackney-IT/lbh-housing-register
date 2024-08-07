import { useEffect, useState } from 'react';

import { FormFieldOption } from '../../lib/types/form';
import {
  SummaryListActions,
  SummaryListKey,
  SummaryListNoBorder,
  SummaryListRow,
  SummaryListValue,
} from '../summary-list';

interface PageProps {
  section: any;
  ethnicity: string;
  setEthnicity: (ethnicity: string) => void;
}

export default function AddCaseEthnicity({
  section,
  ethnicity,
  setEthnicity,
}: PageProps): JSX.Element {
  const handleEthnicityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setEthnicity(value);
  };

  return (
    <SummaryListNoBorder>
      <SummaryListRow>
        <SummaryListKey>Ethnicity</SummaryListKey>
        <SummaryListValue>
          <label htmlFor="ethnicityQuestions_ethnicityMainCategory">
            What is your ethnic group?
          </label>
        </SummaryListValue>
        <SummaryListActions wideActions>
          <>
            <select
              className="govuk-select lbh-select lbh-select--full-width"
              id="ethnicityQuestions_ethnicityMainCategory"
              name="ethnicityQuestions_ethnicityMainCategory"
              onChange={handleEthnicityChange}
              value={ethnicity}
            >
              <option value="">Select an option</option>
              {section.fields[0].options.map((option: FormFieldOption) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        </SummaryListActions>
      </SummaryListRow>
    </SummaryListNoBorder>
  );
}
