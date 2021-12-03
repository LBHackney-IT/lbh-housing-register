import React from 'react';
import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface YourSituationSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function YourSituationSummary({
  currentResident,
}: YourSituationSummaryProps) {
  // TODO: this could be nicer, but we've got a mixture of questions and forms to get answers for
  const armedForces = getQuestionValue(
    currentResident.questions,
    FormID.SITUATION_ARMED_FORCES,
    'situation-armed-forces'
  );
  const courtOrder = getQuestionValue(
    currentResident.questions,
    FormID.COURT_ORDER,
    'court-order'
  );
  const accommodationType = getQuestionValue(
    currentResident.questions,
    FormID.ACCOMODATION_TYPE,
    'accommodation-type'
  );
  const subletting = getQuestionValue(
    currentResident.questions,
    FormID.SUBLETTING,
    'subletting'
  );
  const domesticViolence = getQuestionValue(
    currentResident.questions,
    FormID.DOMESTIC_VIOLENCE,
    'domestic-violence'
  );
  const homelessness = getQuestionValue(
    currentResident.questions,
    FormID.HOMELESSNESS,
    'homelessness'
  );
  const propertyOwnership = getQuestionValue(
    currentResident.questions,
    FormID.PROPERTY_OWNERSHIP,
    'property-ownership'
  );
  const soldProperty = getQuestionValue(
    currentResident.questions,
    FormID.SOLD_PROPERTY,
    'sold-property'
  );
  const buyProperty = getQuestionValue(
    currentResident.questions,
    FormID.PURCHASING_PROPERTY,
    'purchasing-property'
  );
  const arrears = getQuestionValue(
    currentResident.questions,
    FormID.ARREARS,
    'arrears'
  );
  const underOccupying = getQuestionValue(
    currentResident.questions,
    FormID.UNDER_OCCUPYING,
    'under-occupying'
  );
  const otherHousingRegister = getQuestionValue(
    currentResident.questions,
    FormID.OTHER_HOUSING_REGISTER,
    'other-housing-register'
  );
  const breachOfTenancy = getQuestionValue(
    currentResident.questions,
    FormID.BREACH_OF_TENANCY,
    'breach-of-tenancy'
  );
  const breachOfTenancyDetails = getQuestionValue(
    currentResident.questions,
    FormID.BREACH_OF_TENANCY,
    'details'
  );
  const legalRestrictions = getQuestionValue(
    currentResident.questions,
    FormID.LEGAL_RESTRICTIONS,
    'legal-restrictions'
  );
  const unspentConvictions = getQuestionValue(
    currentResident.questions,
    FormID.UNSPENT_CONVICTIONS,
    'unspent-convictions'
  );

  return (
    <SummarySection>
      <SummaryTitle
        content="Your situation"
        href={`/apply/${currentResident.person.id}/${FormID.YOUR_SITUATION}`}
      />

      {!armedForces && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {armedForces && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {armedForces === 'yes'
                ? 'I have, or my partner has'
                : 'I have not, and my partner has not'}
            </strong>{' '}
            served in the armed forces
          </Paragraph>
        </SummaryAnswer>
      )}
      {courtOrder && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{courtOrder === 'yes' ? 'I have' : 'I do not have'}</strong>{' '}
            a court order allowing me to be on the register
          </Paragraph>
        </SummaryAnswer>
      )}
      {accommodationType && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{accommodationType === 'yes' ? 'I am' : 'I am not'}</strong>{' '}
            a social tenant or in temporary accommodation
          </Paragraph>
        </SummaryAnswer>
      )}
      {subletting && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{subletting === 'yes' ? 'I have' : 'I have not'}</strong>{' '}
            sublet my accommodation without permission
          </Paragraph>
        </SummaryAnswer>
      )}
      {domesticViolence && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{domesticViolence === 'yes' ? 'I am' : 'I am not'}</strong>{' '}
            fleeing domestic violence
          </Paragraph>
        </SummaryAnswer>
      )}
      {homelessness && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {homelessness === 'yes' ? 'I have been' : 'I have not'}
            </strong>{' '}
            been found intentionally homelessness by any local housing authority
            (in accordance with the Housing Act 1996 section 184) within the
            last 2 years
          </Paragraph>
        </SummaryAnswer>
      )}
      {propertyOwnership && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{propertyOwnership === 'yes' ? 'I do' : 'I do not'}</strong>{' '}
            own any property
          </Paragraph>
        </SummaryAnswer>
      )}
      {soldProperty && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{soldProperty === 'yes' ? 'I have' : 'I have not'}</strong>{' '}
            sold any property within the last 5 years
          </Paragraph>
        </SummaryAnswer>
      )}
      {buyProperty && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{buyProperty === 'yes' ? 'I am' : 'I am not'}</strong> able
            to buy a property to meet my needs
          </Paragraph>
        </SummaryAnswer>
      )}
      {arrears && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{arrears === 'yes' ? 'I am' : 'I am not'}</strong> in four
            or more weeks arrears with rent, council tax or service charges
          </Paragraph>
        </SummaryAnswer>
      )}
      {underOccupying && (
        <SummaryAnswer>
          <Paragraph>
            <strong>{underOccupying === 'yes' ? 'I am' : 'I am not'}</strong>
            under occupying
          </Paragraph>
        </SummaryAnswer>
      )}
      {otherHousingRegister && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {otherHousingRegister === 'yes'
                ? 'I am, and my partner is'
                : 'I am not, and my partner is not'}
            </strong>{' '}
            on another local authority's housing register
          </Paragraph>
        </SummaryAnswer>
      )}
      {breachOfTenancy && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {breachOfTenancy == 'yes'
                ? 'Someone in my household has'
                : 'Nobody in my household has'}
            </strong>{' '}
            previously received a warning for a breach of tenancy
          </Paragraph>
          {breachOfTenancyDetails && (
            <Paragraph>{breachOfTenancyDetails}</Paragraph>
          )}
        </SummaryAnswer>
      )}
      {legalRestrictions && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {legalRestrictions === 'yes'
                ? 'Somebody in my household'
                : 'Nobody in my household'}
            </strong>{' '}
            has any legal restrictions in where they can live in the borough
          </Paragraph>
        </SummaryAnswer>
      )}
      {unspentConvictions && (
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {unspentConvictions === 'yes'
                ? 'Somebody in my household'
                : 'Nobody in my household'}
            </strong>{' '}
            has any unspent convictions
          </Paragraph>
        </SummaryAnswer>
      )}
    </SummarySection>
  );
}
