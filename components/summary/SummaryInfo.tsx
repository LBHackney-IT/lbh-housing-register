import Link from "next/link";
import React, { ReactNode } from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { HeadingThree } from "../content/headings";
import { AddressHistorySummary } from "./AddressHistory";
import { CurrentAccommodationSummary } from "./CurrentAccommodation";
import { EmploymentSummary } from "./Employment";
import { ImmigrationStatusSummary } from "./ImmigrationStatus";
import { IncomeSavingsSummary } from "./IncomeSavings";
import { MedicalNeedsSummary } from "./MedicalNeeds";
import { ResidentialStatusSummary } from "./ResidentialStatus";
import { YourSituationSummary } from "./YourSituation";

interface SummaryInfoProps {
  currentResident: ApplicantWithPersonID;
}

export function SummaryInfo({ currentResident }: SummaryInfoProps): JSX.Element {

  return (
    <>
      <ImmigrationStatusSummary currentResident={currentResident} />
      <ResidentialStatusSummary currentResident={currentResident} />

      {/* <AddressHistorySummary currentResident={currentResident} data={question} />
      <CurrentAccommodationSummary currentResident={currentResident} data={question} />
      <YourSituationSummary currentResident={currentResident} data={question} /> */}

      <IncomeSavingsSummary currentResident={currentResident} />
      <EmploymentSummary currentResident={currentResident} />

      <MedicalNeedsSummary currentResident={currentResident} />
    </>
  )
}

interface SummaryTitleProps {
  href: string,
  content: string
}

export function SummaryTitle({
  href,
  content
}: SummaryTitleProps): JSX.Element {
  return (
    <div className="lbh-summary-title">
      <HeadingThree content={content} />
      <Link href={href}>
        <a className="lbh-link">Edit</a>
      </Link>
    </div>
  );
}

interface SummaryAnswerProps {
  children: ReactNode
}

export function SummaryAnswer({
  children,
}: SummaryAnswerProps): JSX.Element {
  return (
    <div className="lbh-summary-answer">
      {children}
    </div>
  );
}
