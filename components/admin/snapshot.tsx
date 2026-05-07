import Link from 'next/link';
import { Application } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import {
  applicantHasMedicalNeed,
  applicantsWithMedicalNeed,
} from '../../lib/utils/medicalNeed';
import { questionLookup } from '../../lib/utils/applicationQuestions';

interface PageProps {
  data: Application;
}

export default function Snapshot({ data }: PageProps): JSX.Element {
  if (data.mainApplicant === undefined) {
    return <div>No user data</div>;
  }

  function totalPeopleInApplication() {
    if (data.importedFromLegacyDatabase) return ''; // We don't want this sentence if it's legacy data
    const totalInApplication = (data.otherMembers?.length || 0) + 1;
    return totalInApplication === 1
      ? `There is 1 person in this application.`
      : `There are ${totalInApplication} people in this application.`;
  }

  function medicalNeedText(): JSX.Element | string {
    const totalNumberOfPeopleWithMedicalNeeds = applicantsWithMedicalNeed(data);
    const names = medicalNeedNames();

    switch (totalNumberOfPeopleWithMedicalNeeds) {
      case 0:
        return 'No one has stated a medical need.';
      case 1:
        return names ? (
          <span>1 person, {names}, has stated a medical need.</span>
        ) : (
          '1 person has stated a medical need.'
        );
      default:
        return names ? (
          <span>
            {totalNumberOfPeopleWithMedicalNeeds} people, ( {names} ), have
            stated a medical need.
          </span>
        ) : (
          `${totalNumberOfPeopleWithMedicalNeeds} people have stated a medical need.`
        );
    }
  }

  function medicalNeedNames(): JSX.Element | null {
    const applicantsWithNeeds = [
      data.mainApplicant,
      ...(data.otherMembers ?? []),
    ].filter((a): a is NonNullable<typeof a> => applicantHasMedicalNeed(a));

    if (applicantsWithNeeds.length === 0) return null;

    return (
      <span>
        {applicantsWithNeeds.map((applicant, index) => {
          const name =
            `${applicant.person?.firstName ?? ''} ${applicant.person?.surname ?? ''}`.trim() ||
            'Unknown';
          return (
            <span key={applicant.person?.id ?? index}>
              {index > 0 && ', '}
              <Link
                href={`/applications/view/${data.id}/${applicant.person?.id}`}
                className="lbh-link"
              >
                {name}
              </Link>
            </span>
          );
        })}
      </span>
    );
  }

  function bedroomNeedText() {
    const requiredBedrooms = data.assessment?.bedroomNeed
      ? data.assessment?.bedroomNeed
      : data.calculatedBedroomNeed!;
    return `This household has a ${requiredBedrooms} bedroom need.`;
  }

  function livingSituation() {
    const livingSituation = questionLookup(
      'current-accommodation/living-situation',
    );
    const home = questionLookup('current-accommodation/home');
    const floor = questionLookup('current-accommodation/home-floor');
    const numberSharing = questionLookup(
      'current-accommodation/home-how-many-people-share',
    );

    if (
      livingSituation === undefined ||
      home === undefined ||
      floor === undefined ||
      numberSharing === undefined
    ) {
      return '';
    }

    return `They are currently living ${livingSituation} in ${home} (${floor}) with ${numberSharing} in ${data.mainApplicant?.address?.postcode?.toUpperCase()}`;
  }

  return (
    <Paragraph>
      {`${totalPeopleInApplication()} `}
      {`${livingSituation()} `}
      {`${bedroomNeedText()} `}
      {medicalNeedText()}
    </Paragraph>
  );
}
