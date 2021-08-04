import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface MedicalNeedsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function MedicalNeedsSummary({ currentResident }: MedicalNeedsSummaryProps) {

  const medicalNeeds = getQuestionValue(currentResident.questions, FormID.MEDICAL_NEEDS, 'medical-needs');

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListValue>
            <h3 className="lbh-heading-h3">Medical Needs</h3>
          </SummaryListValue>
          <SummaryListActions>
            <Link href={`/apply/${currentResident.person.id}/${FormID.MEDICAL_NEEDS}`}>
              Edit
            </Link>
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
      {medicalNeeds === 'yes'
        ? <Paragraph><strong>I do</strong> have a medical need that affects my housing needs</Paragraph>
        : <Paragraph><strong>I do not</strong> have any medical needs</Paragraph>
      }
    </div>
  );
}
