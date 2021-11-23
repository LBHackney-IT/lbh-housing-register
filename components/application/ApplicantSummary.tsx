import { useState } from 'react';
import { Applicant } from '../../domain/HousingApi';
import { getGenderName } from '../../lib/utils/gender';
import Link from 'next/link';
import { getAgeInYears } from '../../lib/utils/dateOfBirth';

interface ApplicantSummaryProps {
  applicant: Applicant;
  isMainApplicant: boolean;
  mainApplicantCompleted: boolean;
  applicantNumber: number;
  tasks: { total: number; remaining: number };
}

export default function ApplicantSummary({
  applicant,
  isMainApplicant,
  mainApplicantCompleted,
  applicantNumber,
  tasks,
}: ApplicantSummaryProps): JSX.Element {
  // const [enableHouseholdMembers, setEnableHouseholdMembers] = useState(false);
  const applicantAge = getAgeInYears(applicant);
  const applicantInfo = `(${getGenderName(applicant)}${
    isNaN(applicantAge) ? '' : `, ${applicantAge}`
  })`;

  // console.log(isMainApplicant, mainApplicantCompleted, applicantNumber, tasks);

  const activeSection =
    !isMainApplicant && tasks.remaining > 0 && mainApplicantCompleted;
  console.log(activeSection);

  return (
    <div className="applicant-summary">
      {activeSection ? (
        <>
          <div className="applicant-summary__number lbh-body-l lbh-!-font-weight-bold">
            {applicantNumber}.
          </div>
          <Link href={`/apply/${applicant.person?.id}`}>
            <a className="lbh-link lbh-link--no-visited-state lbh-body-l lbh-!-font-weight-bold lbh-!-margin-top-0">
              {`${applicant.person?.firstName} ${applicant.person?.surname}`}
              <div className="applicant-summary__action">
                {tasks.remaining === 0 ? (
                  <>
                    <svg
                      className="applicant-summary__icon"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 6.66601L2.32006 4.52611L5.64961 7.82384L13.6731 0L16 2.22097L5.64961 12L0 6.66601Z"
                        fill="#00B140"
                      />
                    </svg>
                    Done
                  </>
                ) : tasks.total === tasks.remaining ? (
                  'Start section'
                ) : (
                  'Resume section'
                )}
              </div>
            </a>
          </Link>
        </>
      ) : (
        <>
          <div className="applicant-summary__number lbh-body-l lbh-!-font-weight-bold">
            {applicantNumber}.
          </div>
          <span className="lbh-!-margin-top-0">
            <div className="lbh-body-l lbh-!-font-weight-bold lbh-!-margin-top-0">{`${applicant.person?.firstName} ${applicant.person?.surname}`}</div>
            <div
              className={`applicant-summary__action ${
                tasks.remaining === 0
                  ? 'applicant-summary__action--done'
                  : 'applicant-summary__action--inactive'
              }`}
            >
              <>Can't start yet</>
            </div>
          </span>
        </>
      )}
      {/* <Hint
        content={
          isMainApplicant
            ? `Me ${applicantInfo}`
            : `My ${applicant.person?.relationshipType} ${applicantInfo}`
        }
      /> */}
    </div>
  );
}
