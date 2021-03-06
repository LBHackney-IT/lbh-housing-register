import React from 'react';
import {
  ApplicantWithPersonID,
  getQuestionValue,
} from '../../lib/store/applicant';
import { FormID } from '../../lib/utils/form-data';
import Paragraph from '../content/paragraph';
import { SummaryAnswer, SummarySection, SummaryTitle } from './SummaryInfo';

interface IncomeSavingsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export function IncomeSavingsSummary({
  currentResident,
}: IncomeSavingsSummaryProps) {
  interface Money {
    [key: string]: string;
  }

  const incomeValues: Money = {
    under20000: 'under £20,000',
    '20to40000': '£20,000 - £39,999',
    '40to60000': '£40,000 - £59,999',
    '60to80000': '£60,000 - £79,999',
    '80to100000': '£80,000 - £99,999',
    '100000': '£100,000 or more',
  };

  const savingsValues: Money = {
    under5000: 'under £5,000',
    '5to10000': '£5,000 - £9,999',
    '10to30000': '£10,000 - £29,999',
    '30to50000': '£30,000 - £49,999',
    '50to80000': '£50,000 - £79,999',
    '80000': '£80,000 or more',
  };

  const income = getQuestionValue(
    currentResident.questions,
    FormID.INCOME_SAVINGS,
    'income'
  );
  const savings = getQuestionValue(
    currentResident.questions,
    FormID.INCOME_SAVINGS,
    'savings'
  );

  function getIncome(answer: string) {
    return incomeValues[answer];
  }

  function getSavings(answer: string) {
    return savingsValues[answer];
  }

  return (
    <SummarySection>
      <SummaryTitle
        content="Income & savings"
        href={`/apply/${currentResident.person.id}/${FormID.INCOME_SAVINGS}`}
      />

      {!income && (
        <SummaryAnswer>
          <Paragraph>Not provided yet</Paragraph>
        </SummaryAnswer>
      )}
      {income && (
        <>
          <SummaryAnswer>
            <Paragraph>
              My total yearly household income is{' '}
              <strong>{getIncome(income)}</strong>
            </Paragraph>
          </SummaryAnswer>
          <SummaryAnswer>
            <Paragraph>
              In total, my household has combined savings and capital of{' '}
              <strong>{getSavings(savings)}</strong>
            </Paragraph>
          </SummaryAnswer>
        </>
      )}
    </SummarySection>
  );
}
