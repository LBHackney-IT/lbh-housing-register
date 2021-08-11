import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryAnswer, SummarySection, SummaryTitle } from "./SummaryInfo";

interface ImmigrationStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function ImmigrationStatusSummary({ currentResident }: ImmigrationStatusSummaryProps) {

  const citizenship = getQuestionValue(currentResident.questions, FormID.IMMIGRATION_STATUS, 'citizenship');
  const ukStudying = getQuestionValue(currentResident.questions, FormID.IMMIGRATION_STATUS, 'uk-studying');
  const settledStatus = getQuestionValue(currentResident.questions, FormID.IMMIGRATION_STATUS, 'settled-status');

  function getCitizenship(answer: string) {
    switch (answer) {
      case 'european':
        return 'an EEA';
      case 'british':
        return 'a British';
    }
  }

  function getUkStudying(answer: string) {
    return answer === 'yes' ? 'currently studying in the UK' : '';
  }

  function getSettledStatus(answer: string) {
    return answer === 'yes' ? 'and I have pre-settled status' : '';
  }

  return (

    <SummarySection>
      <SummaryTitle
        content="Immigration Status"
        href={`/apply/${currentResident.person.id}/${FormID.IMMIGRATION_STATUS}`} />

      <SummaryAnswer>
        {!citizenship &&
          <Paragraph>Not provided yet</Paragraph>
        }
        {citizenship &&
          <Paragraph>
            I am <strong>{getCitizenship(citizenship)}</strong> citizen {getUkStudying(ukStudying)} {getSettledStatus(settledStatus)}
          </Paragraph>
        }
      </SummaryAnswer>
    </SummarySection>
  );
}
