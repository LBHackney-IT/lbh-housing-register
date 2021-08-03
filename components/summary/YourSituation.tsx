import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface YourSituationSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function YourSituationSummary({ currentResident, data }: YourSituationSummaryProps) {

  return (
    <>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <SummaryListNoBorder>
          <SummaryListRow>
            <SummaryListValue>
              <h3 className="lbh-heading-h3">Your Situation</h3>
            </SummaryListValue>
            <SummaryListActions>
              <Link href={`/apply/${currentResident.person.id}/your-situation`}>
                Edit
              </Link>
            </SummaryListActions>
          </SummaryListRow>
        </SummaryListNoBorder>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[0]['answer']) === 'yes'
              ? 'I have been'
              : 'I have not'}
          </strong>{' '}
          been found intentionally homelessness by any local housing
          authority(in accordance with the housing act 1996 section 184) within
          the last 2 years
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[1]['answer']) === 'yes' ? 'I do' : 'I do not'}
          </strong>{' '}
          own any property
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[2]['answer']) === 'yes'
              ? 'I have'
              : 'I have not'}
          </strong>{' '}
          sold any property within the last 5 years
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[3]['answer']) === 'yes' ? 'I am' : 'I am not'}
          </strong>{' '}
          in four or more weeks arrears with rent, council tax or service
          charges
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[4]['answer']) === 'yes'
              ? 'I am, and my partner is'
              : 'I am not, and my partner is not'}
          </strong>{' '}
          on another local authority's housing register
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[5]['answer']) == 'yes'
              ? 'Someone in my household has'
              : 'Nobody in my household has'}
          </strong>{' '}
          previously received a warning for a breach of tenancy
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[7]['answer']) === 'yes'
              ? 'Somebody in my household'
              : 'Nobody in my household'}
          </strong>{' '}
          has any legal restrictions in where they can live in the borough
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          <strong>
            {normalizeString(data[8]['answer']) === 'yes'
              ? 'Somebody in my household'
              : 'Nobody in my household'}
          </strong>{' '}
          has any unspent convictions
        </p>
      </div>
    </>
  );
}
