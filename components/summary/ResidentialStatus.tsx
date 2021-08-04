import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryAnswer, SummaryTitle } from "./SummaryInfo";

interface ResidentialStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function ResidentialStatusSummary({ currentResident }: ResidentialStatusSummaryProps) {

  // TODO: add more answers
  const hackneyResident = getQuestionValue(currentResident.questions, FormID.RESIDENTIAL_STATUS, 'residential-status');

  return (
    <>
      <SummaryTitle
        content="Residential Status"
        href={`/apply/${currentResident.person.id}/${FormID.RESIDENTIAL_STATUS}`} />

      <SummaryAnswer>
        {hackneyResident === 'yes'
          ? <Paragraph><strong>I am</strong> currently and continually resided in the borough for 3 years or more</Paragraph>
          : <Paragraph><strong>I am not</strong> currently and continually resided in the borough for 3 years or more</Paragraph>
        }
      </SummaryAnswer>
    </>
  );
}
