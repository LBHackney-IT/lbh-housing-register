import { Application } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import { applicantsWithMedicalNeed } from '../../lib/utils/medicalNeed';
import { questionLookup } from '../../lib/utils/applicationQuestions';
import { calculateBedroomsFromApplication } from '../../lib/utils/bedroomCalculator';

interface PageProps {
  data: Application;
}

export default function Snapshot({ data }: PageProps): JSX.Element {
  if (data.mainApplicant === undefined) {
    return <div>No user data</div>;
  }

  function totalPeopleInApplication() {
    const totalInApplication = (data.otherMembers?.length || 0) + 1;
    return totalInApplication === 1
      ? `There is 1 person in this application.`
      : `There are ${totalInApplication} people in this application.`;
  }

  function medicalNeedText() {
    const totalNumberOfPeopleWithMedicalNeeds = applicantsWithMedicalNeed(data);
    switch (totalNumberOfPeopleWithMedicalNeeds) {
      case 0:
        return 'No one has a medical need.';
      case 1:
        return '1 person who has stated a medical need.';
      default:
    }
    return `${totalNumberOfPeopleWithMedicalNeeds} people have stated a medical need.`;
  }

  function bedroomNeedText() {
    const requiredBedrooms = data.assessment?.bedroomNeed
      ? data.assessment?.bedroomNeed
      : calculateBedroomsFromApplication(data);
    return requiredBedrooms === 1
      ? `1 bedroom is needed for this application.`
      : `${requiredBedrooms} bedrooms are needed for this application.`;
  }

  function livingSituation() {
    const livingSituation = questionLookup(
      'current-accommodation/living-situation'
    );
    const home = questionLookup('current-accommodation/home');
    const floor = questionLookup('current-accommodation/home-floor');
    const numberSharing = questionLookup(
      'current-accommodation/home-how-many-people-share'
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
      {`${medicalNeedText()}`}
    </Paragraph>
  );
}
