import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface EmploymentSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function EmploymentSummary({ currentResident, data }: EmploymentSummaryProps) {

  const formulator = (question: any) => {
    if (retrieveQuestionName(question) === 'employment') {
      switch (normalizeString(question['answer'])) {
        case 'employed':
          return 'full time employed';
        case 'self-employed':
          return 'self employed';
        case 'fulltimestudent':
          return 'a full time student';
        case 'unemployed':
          return 'unemployed';
        case 'retired':
          return 'retired';
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListValue>
            <h3 className="lbh-heading-h3">Employment</h3>
          </SummaryListValue>
          <SummaryListActions>
            <Link href={`/apply/${currentResident.person.id}/employment`}>
              Edit
            </Link>
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
      <p className="lbh-body-m">
        I am <strong>{formulator(data[0])}</strong>
      </p>
    </div>
  );
}
