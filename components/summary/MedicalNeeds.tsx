import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryAnswer, SummaryTitle } from "./SummaryInfo";

interface MedicalNeedsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function MedicalNeedsSummary({ currentResident }: MedicalNeedsSummaryProps) {

  const medicalNeeds = getQuestionValue(currentResident.questions, FormID.MEDICAL_NEEDS, 'medical-needs');

  return (
    <>
      <SummaryTitle
        content="Medical Needs"
        href={`/apply/${currentResident.person.id}/${FormID.MEDICAL_NEEDS}`} />

      <SummaryAnswer>
        {medicalNeeds === 'yes'
          ? <Paragraph><strong>I do</strong> have a medical need that affects my housing needs</Paragraph>
          : <Paragraph><strong>I do not</strong> have any medical needs</Paragraph>
        }
      </SummaryAnswer>
    </>
  );
}
