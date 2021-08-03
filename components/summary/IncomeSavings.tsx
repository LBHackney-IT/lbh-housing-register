import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface IncomeSavingsSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function IncomeSavingsSummary({ currentResident, data }: IncomeSavingsSummaryProps) {

  interface Money {
    [key: string]: string;
  }

  const incomeValues: Money = {
    under20000: 'Under £20,000',
    '20to40000': '£20,000 - £39,999',
    '40to60000': '£40,000 - £59,999',
    '60to80000': '£60,000 - £79,999',
    '80to100000': '£80,000 - £99,999',
    '100000': '£100,000 or more',
  };

  const savingsValues: Money = {
    under5000: 'Under £5,000',
    '5to10000': '£5,000 - £9,999',
    '10to30000': '£10,000 - £29,999',
    '30to50000': '£30,000 - £49,999',
    '50to80000': '£50,000 - £79,999',
    '80000': '£80,000 or more',
  };

  const formulator = (question: any) => {
    if (retrieveQuestionName(question) === 'savings') {
      return savingsValues[normalizeString(question['answer'])];
    }

    if (retrieveQuestionName(question) === 'income') {
      return incomeValues[normalizeString(question['answer'])];
    }
  };
  return (
    <>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <SummaryListNoBorder>
          <SummaryListRow>
            <SummaryListValue>
              <h3 className="lbh-heading-h3">Income & savings</h3>
            </SummaryListValue>
            <SummaryListActions>
              <Link href={`/apply/${currentResident.person.id}/income-savings`}>
                Edit
              </Link>
            </SummaryListActions>
          </SummaryListRow>
        </SummaryListNoBorder>
        <p className="lbh-body-m">
          My total yearly household income is{' '}
          <strong>{formulator(data[0])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          In total, my household has combined savings and capital of{' '}
          <strong>{formulator(data[1])}</strong>
        </p>
      </div>
    </>
  );
}
