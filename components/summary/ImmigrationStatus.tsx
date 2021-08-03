import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface ImmigrationStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function ImmigrationStatusSummary({ currentResident, data }: ImmigrationStatusSummaryProps) {
  const formulator = (question: any) => {
    if (question) {
      if (retrieveQuestionName(question) === 'citizenship') {
        if (normalizeString(question['answer']) === 'european') {
          return 'an EEA';
        }

        if (normalizeString(question['answer']) === 'british') {
          return 'a British';
        }
      }

      if (retrieveQuestionName(question) === 'uk-studying') {
        if (normalizeString(question['answer']) === 'yes') {
          return 'currently studying in the UK';
        }

        if (normalizeString(question['answer']) === 'no') {
          return '';
        }
      }

      if (retrieveQuestionName(question) === 'settled-status') {
        if (normalizeString(question['answer']) === 'yes') {
          return 'and I have a pre-settled status';
        }

        if (normalizeString(question['answer']) === 'no') {
          return '';
        }
      }
    }
  };

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListValue>
            <h3 className="lbh-heading-h3">Immigration status</h3>
          </SummaryListValue>
          <SummaryListActions>
            <Link href={`/apply/${currentResident.person.id}/immigration-status`}>
              Edit
            </Link>
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
      <p className="lbh-body-m">
        I am <strong>{formulator(data[0])}</strong> citizen{' '}
        <strong>{data[1] ? formulator(data[1]) : ''}</strong>{' '}
        <strong>{data[2] ? formulator(data[2]) : ''}</strong>
      </p>
    </div>
  );
}
