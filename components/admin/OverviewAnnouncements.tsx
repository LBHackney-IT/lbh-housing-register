import Announcement from '../../components/announcement';
import Details from '../../components/details';
import Paragraph from '../../components/content/paragraph';
import { Applicant } from '../../domain/HousingApi';

interface OverviewAnnouncementProps {
  title: string;
  details: Array<string>;
}

function OverviewAnnouncement({ title, details }: OverviewAnnouncementProps) {
  return (
    <Announcement variant="info">
      <h3 className="lbh-page-announcement__title">{title}</h3>
      <div className="lbh-page-announcement__content">
        <Details summary="Show details">
          {details?.map((detail, index) => (
            <Paragraph key={index}>{detail.replace(/['"]+/g, '')}</Paragraph>
          ))}
        </Details>
      </div>
    </Announcement>
  );
}

interface OverviewAnnouncementsProps {
  applicant: Applicant;
}

export default function OverviewAnnouncements({
  applicant,
}: OverviewAnnouncementsProps) {
  const isCurrentlyHomeless = applicant.questions?.filter((question) =>
    question.id?.includes('additional-questions/currently-homeless-details')
  );
  const isAtRiskOfHomelessness = applicant.questions?.filter((question) =>
    question.id?.includes('additional-questions/risk-of-homelessness-details')
  );
  const isAtRiskOfDomesticViolence = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/risk-of-domestic-violence-details'
    )
  );
  const isAtRiskOfGangViolence = applicant.questions?.filter((question) =>
    question.id?.includes('additional-questions/risk-of-gang-violence-details')
  );
  const isUnderWitnessProtection = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/witness-mobility-scheme-details'
    )
  );
  const isEmployeeOrRelated = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/employee-hackney-council-details'
    )
  );
  const isElectedOrRelated = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/elected-member-hackney-council-details'
    )
  );

  const isCurrentlyHomelessString = isCurrentlyHomeless?.[0]?.answer || '';
  const isAtRiskOfHomelessnessString =
    isAtRiskOfHomelessness?.[0]?.answer || '';
  const isAtRiskOfDomesticViolenceString =
    isAtRiskOfDomesticViolence?.[0]?.answer || '';
  const isAtRiskOfGangViolenceString =
    isAtRiskOfGangViolence?.[0]?.answer || '';
  const isUnderWitnessProtectionString =
    isUnderWitnessProtection?.[0]?.answer || '';
  const isEmployeeOrRelatedString = isEmployeeOrRelated?.[0]?.answer || '';
  const isElectedOrRelatedString = isElectedOrRelated?.[0]?.answer || '';

  return (
    <>
      {isCurrentlyHomeless?.length ? (
        <OverviewAnnouncement
          title="Household member(s) currently homeless"
          details={[isCurrentlyHomelessString]}
        />
      ) : null}
      {isAtRiskOfHomelessness?.length ? (
        <OverviewAnnouncement
          title="Household member(s) at risk of homelessness"
          details={[isAtRiskOfHomelessnessString]}
        />
      ) : null}
      {isAtRiskOfDomesticViolence?.length ? (
        <OverviewAnnouncement
          title="Household member(s) at risk of domestic violence"
          details={[isAtRiskOfDomesticViolenceString]}
        />
      ) : null}
      {isAtRiskOfGangViolence?.length ? (
        <OverviewAnnouncement
          title="Household member(s) at risk of gang violence"
          details={[isAtRiskOfGangViolenceString]}
        />
      ) : null}
      {isUnderWitnessProtection?.length ? (
        <OverviewAnnouncement
          title="Household member(s) under witness protection"
          details={[isUnderWitnessProtectionString]}
        />
      ) : null}
      {isEmployeeOrRelated?.length || isElectedOrRelated?.length ? (
        <OverviewAnnouncement
          title="Household member(s) have links to the council"
          details={[isEmployeeOrRelatedString, isElectedOrRelatedString]}
        />
      ) : null}
    </>
  );
}
