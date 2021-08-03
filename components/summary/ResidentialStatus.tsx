import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface ResidentialStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function ResidentialStatusSummary({ currentResident, data }: ResidentialStatusSummaryProps) {

  // TODO: add answers

  return (
    <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
      <h3 className="lbh-heading-h3">Residential Status</h3>
      <p className="lbh-body-m"></p>
    </div>
  );
}
