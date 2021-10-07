import { Applicant } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormID } from './form-data';

export const getRequiredDocumentsForApplication = (
  applicant: Applicant
): Array<string> => {
  let documentTypes = [
    'proof-of-id',
    'proof-of-address',
    'proof-of-income',
    'proof-of-savings',
  ];

  const employment = getQuestionValue(
    applicant.questions,
    FormID.EMPLOYMENT,
    'employment'
  );
  if (employment === 'retired') {
    documentTypes.push('proof-of-pension');
  }

  return documentTypes;
};
