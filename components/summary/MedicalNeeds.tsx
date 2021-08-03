import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface MedicalNeedsSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function MedicalNeedsSummary({ currentResident, data }: MedicalNeedsSummaryProps) {

  const formulator = (question: any) => {
    if (retrieveQuestionName(question) === 'medical-needs') {
      if (normalizeString(question['answer']) === 'yes') {
        return 'I do';
      }
      if (normalizeString(question['answer']) === 'no') {
        return 'I do not';
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListValue>
            <h3 className="lbh-heading-h3">Medical Needs</h3>
          </SummaryListValue>
          <SummaryListActions>
            <Link href={`/apply/${currentResident.person.id}/medical-needs`}>
              Edit
            </Link>
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
      <p className="lbh-body-m">
        <strong>{`${formulator(data[0])}`}</strong> have{' '}
        {normalizeString(data[0]['answer']) === 'yes'
          ? 'a medical need that affects my housing needs'
          : 'any medical needs'}
      </p>
    </div>
  );
}
