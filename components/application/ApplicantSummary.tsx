import { Applicant } from '../../domain/HousingApi';
import Link from 'next/link';
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
  return (
    <>
      {isMainApplicant || mainApplicantCompleted ? (
        <div
          className={`lbh-applicant-summary ${
            tasks.remaining === 0 ? 'lbh-applicant-summary--done' : ''
          }`}
        >
          <div className="lbh-applicant-summary__number lbh-body-l lbh-!-font-weight-bold">
            {applicantNumber}.
          </div>
          <span className="lbh-!-margin-top-0">
            <Link href={`/apply/${applicant.person?.id}`}>
              <a className="lbh-applicant-summary__name lbh-link lbh-link--no-visited-state lbh-body-l lbh-!-font-weight-bold lbh-!-margin-top-0">
                {`${applicant.person?.firstName} ${applicant.person?.surname}`}
                {tasks.remaining !== 0 ? (
                  <div className="lbh-applicant-summary__action">
                    {tasks.total === tasks.remaining
                      ? 'Start section'
                      : 'Resume section'}
                  </div>
                ) : null}
              </a>
            </Link>
            {tasks.remaining === 0 ? (
              <div className="lbh-applicant-summary__action lbh-applicant-summary__action--done">
                <svg
                  className="lbh-applicant-summary__icon"
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
              </div>
            ) : null}
          </span>
        </div>
      ) : (
        <div className="lbh-applicant-summary lbh-applicant-summary--inactive">
          <div className="lbh-applicant-summary__number lbh-body-l lbh-!-font-weight-bold">
            {applicantNumber}.
          </div>
          <span className="lbh-!-margin-top-0">
            <div className="lbh-applicant-summary__name lbh-body-l lbh-!-font-weight-bold lbh-!-margin-top-0">{`${applicant.person?.firstName} ${applicant.person?.surname}`}</div>
            <div className="lbh-applicant-summary__action lbh-applicant-summary__action--inactive">
              Can't start yet
            </div>
          </span>
        </div>
      )}
    </>
  );
}
