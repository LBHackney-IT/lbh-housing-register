import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryAnswer, SummaryTitle } from "./SummaryInfo";

interface EmploymentSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function EmploymentSummary({ currentResident }: EmploymentSummaryProps) {

  const employment = getQuestionValue(currentResident.questions, FormID.EMPLOYMENT, 'employment');
  const getEmploymentType = () => {
    switch (employment) {
      case 'employed':
        return 'full time employed';
      case 'selfemployed':
        return 'self employed';
      case 'fulltimestudent':
        return 'a full time student';
      case 'unemployed':
        return 'unemployed';
      case 'retired':
        return 'retired';
    }
  }

  return (
    <>
      <SummaryTitle
        content="Employment"
        href={`/apply/${currentResident.person.id}/${FormID.EMPLOYMENT}`} />

      <SummaryAnswer>
        <Paragraph>I am <strong>{getEmploymentType()}</strong></Paragraph>
      </SummaryAnswer>
    </>
  );
}
