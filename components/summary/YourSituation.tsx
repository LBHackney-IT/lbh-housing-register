import React from "react";
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { FormID } from "../../lib/utils/form-data";
import Paragraph from "../content/paragraph";
import { SummaryAnswer, SummarySection, SummaryTitle } from "./SummaryInfo";

interface YourSituationSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function YourSituationSummary({ currentResident }: YourSituationSummaryProps) {

  // TODO: this could be nicer, but we've got a mixture of questions and forms to get answers for
  const homelessness = getQuestionValue(currentResident.questions, FormID.HOMELESSESS, 'homelessness');
  const propertyOwnership = getQuestionValue(currentResident.questions, FormID.PROPERTY_OWNERSHIP, 'property-ownership');
  const soldProperty = getQuestionValue(currentResident.questions, FormID.SOLD_PROPERTY, 'sold-property');
  const arrears = getQuestionValue(currentResident.questions, FormID.ARREARS, 'arrears');
  const otherHousingRegister = getQuestionValue(currentResident.questions, FormID.OTHER_HOUSING_REGISTER, 'other-housing-register');
  const breachOfTenancy = getQuestionValue(currentResident.questions, FormID.BREACH_OF_TENANCY, 'breach-of-tenancy');
  const breachOfTenancyDetails = getQuestionValue(currentResident.questions, FormID.BREACH_OF_TENANCY, 'breach-of-tenancy-details');
  const legalRestrictions = getQuestionValue(currentResident.questions, FormID.LEAGLE_RESTRICTIONS, 'legal-restrictions');
  const unspentConvictions = getQuestionValue(currentResident.questions, FormID.UNSPENT_CONVICTIONS, 'unspent-convictions');

  return (
    <SummarySection>
      <SummaryTitle
        content="Your situation"
        href={`/apply/${currentResident.person.id}/${FormID.YOUR_SITUATION}`} />

      {!homelessness &&
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      }
      {homelessness &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {homelessness === 'yes' ? 'I have been' : 'I have not'}
            </strong> been found intentionally homelessness by any local housing
            authority (in accordance with the housing act 1996 section 184) within
            the last 2 years
          </Paragraph>
        </SummaryAnswer>
      }
      {propertyOwnership &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {propertyOwnership === 'yes' ? 'I do' : 'I do not'}
            </strong> own any property
          </Paragraph>
        </SummaryAnswer>
      }
      {soldProperty &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {soldProperty === 'yes' ? 'I have' : 'I have not'}
            </strong> sold any property within the last 5 years
          </Paragraph>
        </SummaryAnswer>
      }
      {arrears &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {arrears === 'yes' ? 'I am' : 'I am not'}
            </strong> in four or more weeks arrears with rent, council tax or service charges
          </Paragraph>
        </SummaryAnswer>
      }
      {otherHousingRegister &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {otherHousingRegister === 'yes'
                ? 'I am, and my partner is'
                : 'I am not, and my partner is not'}
            </strong> on another local authority's housing register
          </Paragraph>
        </SummaryAnswer>
      }
      {breachOfTenancy &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {breachOfTenancy == 'yes'
                ? 'Someone in my household has'
                : 'Nobody in my household has'}
            </strong> previously received a warning for a breach of tenancy
          </Paragraph>
          {breachOfTenancyDetails &&
            <Paragraph>
              {breachOfTenancyDetails}
            </Paragraph>
          }
        </SummaryAnswer>
      }
      {legalRestrictions &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {legalRestrictions === 'yes'
                ? 'Somebody in my household'
                : 'Nobody in my household'}
            </strong> has any legal restrictions in where they can live in the borough
          </Paragraph>
        </SummaryAnswer>
      }
      {unspentConvictions &&
        <SummaryAnswer>
          <Paragraph>
            <strong>
              {unspentConvictions === 'yes'
                ? 'Somebody in my household'
                : 'Nobody in my household'}
            </strong> has any unspent convictions
          </Paragraph>
        </SummaryAnswer>
      }
    </SummarySection>
  );
}
