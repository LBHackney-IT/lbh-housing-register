import { ApplicantWithPersonID } from "../../lib/store/applicant";
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
      return <MedicalNeedsSummary currentResident={currentResident} data={question} />
    case 'address-history':
      return <AddressHistorySummary currentResident={currentResident} data={question} />
  }

  return <></>;
}
