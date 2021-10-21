import React from 'react';
import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface ResidentialStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function ResidentialStatusSummary({
  currentResident,
}: ResidentialStatusSummaryProps) {
  function lookupAnswer(question: string) {
    return getQuestionValue(
      currentResident.questions,
      FormID.RESIDENTIAL_STATUS,
      question
    );
  }

  const hackneyResident = lookupAnswer('residential-status');
  const movedBorough = lookupAnswer('moved-borough');
  const homeless = lookupAnswer('homeless');
  const asboBehavior = lookupAnswer('asbo-behaviour');
  const armedForces = lookupAnswer('armed-forces');
  const mobilityScheme = lookupAnswer('mobility-scheme');
  const homelessnessAccepted = lookupAnswer('homelessness-accepted');
  const socialHousing = lookupAnswer('social-housing');
  const workInHackney = lookupAnswer('work-in-hackney');
  const providingCare = lookupAnswer('providing-care');
  const domesticViolence = lookupAnswer('domestic-violence');
  const studyingOutsideBorough = lookupAnswer('studying-outside-borough');
  const institutions = lookupAnswer('institutions');

  return (
    <SummarySection>
      <SummaryTitle
        content="Residential Status"
        href={`/apply/${currentResident.person.id}/${FormID.RESIDENTIAL_STATUS}`}
      />

      {!hackneyResident && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {hackneyResident && (
        <>
          <SummaryAnswer>
            <Paragraph>
              <strong>I am{hackneyResident !== 'yes' && ' not'}</strong>{' '}
              currently and have continuously resided in the borough for 3 years
              or more.
            </Paragraph>
          </SummaryAnswer>
          {movedBorough && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I have{movedBorough !== 'yes' && ' not'}</strong> in the
                last 3 years moved out and moved back into the borough within 3
                months.
              </Paragraph>
            </SummaryAnswer>
          )}
          {homeless && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I am{homeless !== 'yes' && ' not'}</strong> currently
                homeless and placed in temporary accommodation outside of the
                borough.
              </Paragraph>
            </SummaryAnswer>
          )}
          {asboBehavior && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I am{asboBehavior !== 'yes' && ' not'}</strong> unable
                to reside in the borough due to a court order or an injunction
                due to unacceptable behaviour.
              </Paragraph>
            </SummaryAnswer>
          )}
          {armedForces && (
            <SummaryAnswer>
              <Paragraph>
                <strong>
                  I (or my partner) are{armedForces !== 'yes' && ' not'}
                </strong>{' '}
                serving, or ex-serving member of the armed forces.
              </Paragraph>
            </SummaryAnswer>
          )}
          {mobilityScheme && (
            <SummaryAnswer>
              <Paragraph>
                <strong>
                  I (or my partner) am{mobilityScheme !== 'yes' && ' not'}
                </strong>{' '}
                a nominee under National Witness Mobility Scheme.
              </Paragraph>
            </SummaryAnswer>
          )}
          {homelessnessAccepted && (
            <SummaryAnswer>
              <Paragraph>
                <strong>
                  I have{homelessnessAccepted !== 'yes' && ' not'}
                </strong>{' '}
                been accepted as Homeless by the Council with a duty to provide
                accomodation under the Housing Act 1996.
              </Paragraph>
            </SummaryAnswer>
          )}
          {socialHousing && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I am{socialHousing !== 'yes' && ' not'}</strong> an
                existing social housing tenant in Hackney who has a secure,
                assured or fixed term tenancy.
              </Paragraph>
            </SummaryAnswer>
          )}
          {workInHackney && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I do{workInHackney !== 'yes' && ' not'}</strong> work in
                Hackney or have been offered a permanent job in Hackney.
              </Paragraph>
            </SummaryAnswer>
          )}
          {providingCare && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I am{providingCare !== 'yes' && ' not'}</strong> moving
                to Hackney to provide care to a Hackney resident that has been
                agreed by the Council's medical advisor.
              </Paragraph>
            </SummaryAnswer>
          )}
          {domesticViolence && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I am{domesticViolence !== 'yes' && ' not'}</strong>{' '}
                fleeing domestic or familial violence, or need to move to
                Hackney due to social or welfare reasons.
              </Paragraph>
            </SummaryAnswer>
          )}
          {studyingOutsideBorough && (
            <SummaryAnswer>
              <Paragraph>
                <strong>
                  I am{studyingOutsideBorough !== 'yes' && ' not'}
                </strong>{' '}
                a student living and studying away from the borough.
              </Paragraph>
            </SummaryAnswer>
          )}
          {institutions && (
            <SummaryAnswer>
              <Paragraph>
                <strong>I have{institutions !== 'yes' && ' not'}</strong> been
                in any of the following institution for the last 3 years or
                more.
              </Paragraph>
              <Paragraph>
                Hospital,
                <br />
                Prison,
                <br />
                Care Home,
                <br />
                Foster Placement,
                <br />
                Accommodation provided by social services
              </Paragraph>
            </SummaryAnswer>
          )}
        </>
      )}
    </SummarySection>
  );
}
