import React from 'react';
import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface ImmigrationStatusSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function ImmigrationStatusSummary({
  currentResident,
}: ImmigrationStatusSummaryProps) {
  const citizenship = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'citizenship'
  );
  const ukStudying = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'uk-studying'
  );

  const settledStatus = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'settled-status'
  );

  const workOrStudyVisa = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'work-or-study-visa'
  );

  const receivingSponsorship = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'receiving-sponsorship'
  );

  const legalStatus = getQuestionValue(
    currentResident.questions,
    FormID.IMMIGRATION_STATUS,
    'legal-status'
  );

  function getUkStudying(answer: string) {
    return answer === 'yes' ? ' currently studying in the UK.' : '';
  }

  function getSettledStatus(answer: string) {
    switch (answer) {
      case 'yes':
        return ' and I have pre-settled status.';
      case 'no':
        return ' without settled status or pre-settled status.';
      default:
        return '';
    }
  }

  function getWorkOrStudyVisa(answer: string) {
    return answer === 'yes'
      ? ', and I am in the UK on a work or study visa.'
      : '';
  }

  function getReceivingSponsorship(answer: string) {
    return answer === 'yes'
      ? ', and I am receiving sponsorship to stay in the UK.'
      : '';
  }

  function getLegalStatus(answer: string) {
    return answer === 'limited-leave-to-remain-no-public-funds'
      ? ', and I have Limited Leave to Remain in the UK with no recourse to public funds.'
      : '';
  }

  function getCitizenshipString(answer: string) {
    switch (answer) {
      case 'british':
        return 'a British';
      case 'european':
        return 'an EEA';
      case 'other':
      default:
        return 'a non-EEA';
    }
  }

  function getStatusString(answer: string) {
    switch (answer) {
      case 'british':
        return '.';
      case 'european':
        return (
          <>
            {getUkStudying(ukStudying) ? getUkStudying(ukStudying) : null}
            {getSettledStatus(settledStatus) && ukStudying === 'no'
              ? getSettledStatus(settledStatus)
              : null}
          </>
        );
      case 'other':
      default:
        return (
          <>
            {getWorkOrStudyVisa(workOrStudyVisa)
              ? getWorkOrStudyVisa(workOrStudyVisa)
              : null}
            {getReceivingSponsorship(receivingSponsorship) &&
            workOrStudyVisa === 'no'
              ? getReceivingSponsorship(receivingSponsorship)
              : null}
            {getLegalStatus(legalStatus) &&
            workOrStudyVisa === 'no' &&
            receivingSponsorship === 'no'
              ? getLegalStatus(legalStatus)
              : null}
          </>
        );
    }
  }

  return (
    <SummarySection>
      <SummaryTitle
        content="Immigration Status"
        href={`/apply/${currentResident.person.id}/${FormID.IMMIGRATION_STATUS}`}
      />

      <SummaryAnswer>
        {!citizenship && <Paragraph>Not provided yet</Paragraph>}
        {citizenship && (
          <Paragraph>
            I am <strong>{getCitizenshipString(citizenship)}</strong> citizen
            {getStatusString(citizenship)}
          </Paragraph>
        )}
      </SummaryAnswer>
    </SummarySection>
  );
}
