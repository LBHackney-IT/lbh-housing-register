import { Applicant } from '../../domain/HousingApi';
import { getGenderName } from '../../lib/utils/gender';
import Link from 'next/link';
import Hint from '../form/hint';
import { getAgeInYears } from '../../lib/utils/dateOfBirth';

interface ApplicantNameProps {
  applicant: Applicant;
  isMainApplicant: boolean;
}

export default function ApplicantName({
  applicant,
  isMainApplicant,
}: ApplicantNameProps): JSX.Element {
  const applicantAge = getAgeInYears(applicant);
  const applicantInfo = `(${getGenderName(applicant)}${
    isNaN(applicantAge) ? '' : `, ${applicantAge}`
  })`;
  return (
    <>
      <Link href={`/apply/${applicant.person?.id}`}>
        {`${applicant.person?.firstName} ${applicant.person?.surname}`}
      </Link>
      <Hint
        content={
          isMainApplicant
            ? `Me ${applicantInfo}`
            : `My ${applicant.person?.relationshipType} ${applicantInfo}`
        }
      />
    </>
  );
}
