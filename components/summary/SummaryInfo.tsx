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
  question: any;
}

export function SummaryInfo({ currentResident, question }: SummaryInfoProps): JSX.Element {
  const sectionName = question[0]['id'].substring(0, question[0]['id'].lastIndexOf('/'));
  switch (sectionName) {
    case 'immigration-status':
      return <ImmigrationStatusSummary currentResident={currentResident} data={question} />
    case 'residential-status':
      return <ResidentialStatusSummary currentResident={currentResident} data={question} />
    case 'current-accommodation':
      return <CurrentAccommodationSummary currentResident={currentResident} data={question} />
    case 'my-situation':
      return <YourSituationSummary currentResident={currentResident} data={question} />
    case 'income-savings':
      return <IncomeSavingsSummary currentResident={currentResident} data={question} />
    case 'employment':
      return <EmploymentSummary currentResident={currentResident} data={question} />
    case 'medical-needs':
      return <MedicalNeedsSummary currentResident={currentResident} />
    case 'address-history':
      return <AddressHistorySummary currentResident={currentResident} data={question} />
  }

  return <></>;
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
