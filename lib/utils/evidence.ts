import { Applicant } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { EvidenceType } from '../types/evidence';
import { FormID } from './form-data';

export const getRequiredDocumentsForApplication = (
  applicant: Applicant
): string[] => {
  const employment = getQuestionValue(
    applicant.questions,
    FormID.EMPLOYMENT,
    'employment'
  );

  return [
    EvidenceType.PROOF_OF_ID,
    EvidenceType.PROOF_OF_ADDRESS,
    EvidenceType.PROOF_OF_INCOME,
    EvidenceType.PROOF_OF_SAVINGS,
    ...(employment === 'retired' ? [EvidenceType.PROOF_OF_PENSION] : []),
  ];
};
