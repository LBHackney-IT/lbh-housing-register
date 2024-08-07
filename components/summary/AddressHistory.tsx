import React from 'react';

import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import {
  AddressHistoryEntry,
  calculateDurations,
} from '../../lib/utils/addressHistory';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import Hint from '../form/hint';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface AddressHistorySummaryProps {
  currentResident: ApplicantWithPersonID;
}

export const AddressHistorySummary = ({
  currentResident,
}: AddressHistorySummaryProps) => {
  const addressHistory = getQuestionValue(
    currentResident.questions,
    FormID.ADDRESS_HISTORY,
    'addressHistory'
  );
  const durations = calculateDurations(addressHistory);

  return (
    <SummarySection>
      <SummaryTitle
        content="Address history"
        href={`/apply/${currentResident.person.id}/${FormID.ADDRESS_HISTORY}`}
      />

      {!addressHistory && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {addressHistory &&
        addressHistory.map((address: AddressHistoryEntry, index: number) => {
          return (
            <SummaryAnswer key={index}>
              <Paragraph>
                <Hint
                  content={index === 0 ? 'Current address' : 'Previous address'}
                />
                <strong>
                  {address.address.line1}, {address.address.town},{' '}
                  {address.postcode}
                  <br />
                  {durations[index].label}
                </strong>
              </Paragraph>
            </SummaryAnswer>
          );
        })}
    </SummarySection>
  );
};
