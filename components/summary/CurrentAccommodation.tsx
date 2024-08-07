import React from 'react';

import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface CurrentAccommodationSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export const CurrentAccommodationSummary = ({
  currentResident,
}: CurrentAccommodationSummaryProps) => {
  const livingSituation = getQuestionValue(
    currentResident.questions,
    FormID.CURRENT_ACCOMMODATION,
    'living-situation'
  );
  const homeSituation = getQuestionValue(
    currentResident.questions,
    FormID.CURRENT_ACCOMMODATION,
    'home'
  );

  const unsuitable = getQuestionValue(
    currentResident.questions,
    FormID.CURRENT_ACCOMMODATION,
    'why-home-unsuitable'
  );

  function lookupAnswer(question: string) {
    return getQuestionValue(
      currentResident.questions,
      FormID.CURRENT_ACCOMMODATION,
      question
    );
  }

  function getLivingSituation(answer: string) {
    switch (answer) {
      case 'living-with-parents':
        return 'with parents';
      case 'living-with-friends':
        return 'with friends';
      case 'living-with-relatives':
        return 'with relatives';
      case 'temp-accomodation':
        return 'in temporary accommodation';
      case 'private-rental':
        return 'in private rental';
      case 'owner-occupier':
        return 'as an owner occupier';
      case 'no-fixed-abode':
        return 'in no fixed abode';
      case 'squatter':
        return 'as a squatter';
      case 'lodger':
        return 'as a lodger';
      case 'unauthorised-occupant':
        return 'as an unauthorised occupant';
      case 'tied-accommodation':
        return 'in tied accommodation';
      case 'council-tenant':
        return 'as a council tenant';
      case 'housing-association-tenant':
        return 'as a housing association tenant';
      case 'b&b-hotel-hostel':
        return 'in a B&B, hotel or hostel';
    }
  }

  function getHomeSituation(answer: string) {
    switch (answer) {
      case 'house':
        return 'house';
      case 'flat':
        return 'flat';
      case 'flat-above-shop':
        return 'flat above shop';
      case 'maisonnette':
        return 'maisonnette';
      case 'bungalow':
        return 'bungalow';
      case 'hotel-hostel':
        return 'hotel hostel';
      case 'boat':
        return 'boat';
      case 'caravan':
        return 'caravan';
      case 'studio':
        return 'studio';
      case 'other':
        return 'other';
    }
  }

  return (
    <SummarySection>
      <SummaryTitle
        content="Current accommodation"
        href={`/apply/${currentResident.person.id}/${FormID.CURRENT_ACCOMMODATION}`}
      />

      {!livingSituation && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {livingSituation && (
        <>
          <SummaryAnswer>
            <Paragraph>
              I am living <strong>{getLivingSituation(livingSituation)}</strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              I live in a <strong>{getHomeSituation(homeSituation)}</strong>
            </Paragraph>
          </SummaryAnswer>

          <SummaryAnswer>
            <Paragraph>
              My home is on the <strong>{lookupAnswer('home-floor')}</strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              I share my home with{' '}
              <strong>
                {lookupAnswer('home-how-many-people-share')} people
              </strong>{' '}
              not included in this application
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-bedrooms')} bedroom(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-livingrooms')} living room(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-diningrooms')} dining room(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>

          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-bathrooms')} bathroom(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-kitchens')} kitchen(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              My home has{' '}
              <strong>
                {lookupAnswer('home-how-many-other-rooms')} other room(s)
              </strong>
            </Paragraph>
          </SummaryAnswer>
          {unsuitable && (
            <SummaryAnswer>
              <Paragraph>My current home is unsuitable: {unsuitable}</Paragraph>
            </SummaryAnswer>
          )}
        </>
      )}
    </SummarySection>
  );
};
