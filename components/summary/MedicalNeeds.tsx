import React from 'react';

import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface MedicalNeedsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export const MedicalNeedsSummary = ({
  currentResident,
}: MedicalNeedsSummaryProps) => {
  const medicalNeeds = getQuestionValue(
    currentResident.questions,
    FormID.MEDICAL_NEEDS,
    'medical-needs'
  );

  return (
    <SummarySection>
      <SummaryTitle
        content="Health"
        href={`/apply/${currentResident.person.id}/${FormID.MEDICAL_NEEDS}`}
      />

      {!medicalNeeds && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {medicalNeeds && (
        <SummaryAnswer>
          {medicalNeeds === 'yes' ? (
            <Paragraph>
              <strong>I do</strong> have a medical need that affects my housing
              needs
            </Paragraph>
          ) : (
            <Paragraph>
              <strong>I do not</strong> have any medical needs
            </Paragraph>
          )}
        </SummaryAnswer>
      )}
    </SummarySection>
  );
};
