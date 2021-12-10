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

  const isAtRiskOfDomesticViolence = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/risk-of-domestic-violence-details'
    )
  );

  const isUnderWitnessProtection = applicant.questions?.filter((question) =>
    question.id?.includes(
      'additional-questions/witness-mobility-scheme-details'
    )
  );

  const isEmployeeOrRelatedString = isEmployeeOrRelated?.[0]?.answer || '';
  const isElectedOrRelatedString = isElectedOrRelated?.[0]?.answer || '';
  const isAtRiskOfDomesticViolenceString =
    isAtRiskOfDomesticViolence?.[0]?.answer || '';
  const isUnderWitnessProtectionString =
    isUnderWitnessProtection?.[0]?.answer || '';

  return (
    <>
      {isAtRiskOfDomesticViolence?.length ? (
        <OverviewAnnouncement
          title="Household member(s) at risk of domestic violence"
          details={[isAtRiskOfDomesticViolenceString]}
        />
      ) : null}
      {isEmployeeOrRelated?.length || isElectedOrRelated?.length ? (
        <OverviewAnnouncement
          title="Household member(s) have links to the council"
          details={[isEmployeeOrRelatedString, isElectedOrRelatedString]}
        />
      ) : null}
      {isUnderWitnessProtection?.length ? (
        <OverviewAnnouncement
          title="Household member(s) under witness protection"
          details={[isUnderWitnessProtectionString]}
        />
      ) : null}
    </>
  );
}
