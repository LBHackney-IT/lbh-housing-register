import React, { useState } from 'react';

import { Applicant } from '../../domain/HousingApi';
import capitalize from '../../lib/utils/capitalize';
import { formatDob } from '../../lib/utils/dateOfBirth';
import { getGenderName } from '../../lib/utils/gender';
import { ButtonLink } from '../button';
import { HeadingThree } from '../content/headings';
import Paragraph from '../content/paragraph';
import Dialog from '../dialog';

interface SummaryProps {
  heading: string;
  others: Applicant[];
  applicationId: string;
  canEdit: boolean;
  handleDelete: (applicant: Applicant) => void;
  userError?: string;
}

export default function OtherMembers({
  heading,
  others,
  applicationId,
  canEdit,
  handleDelete,
  userError,
}: SummaryProps): JSX.Element {
  const [showDeleteWarningDialog, setShowDeleteWarningDialog] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState({} as Applicant);

  const handleDeleteDialog = (applicant: Applicant): void => {
    setApplicantToDelete(applicant);
    setShowDeleteWarningDialog(true);
  };

  return (
    <>
      <HeadingThree content={heading} />
      <table
        className="govuk-table lbh-table"
        style={{ marginTop: '1em' }}
        data-testid="test-other-household-members"
      >
        <tbody className="govuk-table__body">
          {others.map((applicant) => (
            <tr key={applicant.person?.id} className="govuk-table__row">
              <td className="govuk-table__cell">
                <ul className="lbh-list lbh-list--compressed">
                  <li>
                    <strong>
                      {applicant.person?.title} {applicant.person?.firstName}{' '}
                      {applicant.person?.surname}
                    </strong>{' '}
                    {getGenderName(applicant) !== ''
                      ? `(${getGenderName(applicant)})`
                      : ''}
                  </li>
                  <li>
                    {applicant.person?.dateOfBirth &&
                      formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                    {applicant.person?.age !== null &&
                      `(age ${applicant.person?.age})`}
                  </li>
                  <li>
                    Relationship:{' '}
                    {applicant.person?.relationshipType &&
                      capitalize(applicant.person?.relationshipType)}
                  </li>
                </ul>
                {canEdit && (
                  <button
                    onClick={() => handleDeleteDialog(applicant)}
                    className="lbh-body-s lbh-link lbh-link--no-visited-state lbh-delete-link"
                    data-testid={`test-remove-household-member-button-${applicant.person?.id}`}
                  >
                    Remove household member
                  </button>
                )}

                <Dialog
                  isOpen={showDeleteWarningDialog && !userError}
                  title="Confirm delete"
                  onConfirmation={() => handleDelete(applicantToDelete)}
                  onCancel={() => setShowDeleteWarningDialog(false)}
                  confirmationButtonTestId={`test-remove-household-member-confirmation-button-${applicant.person?.id}`}
                >
                  <Paragraph>
                    Are you sure you want to remove{' '}
                    {applicantToDelete.person?.title}{' '}
                    {applicantToDelete.person?.firstName}{' '}
                    {applicantToDelete.person?.surname}?
                  </Paragraph>
                </Dialog>
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                {canEdit && (
                  <ButtonLink
                    additionalCssClasses="govuk-secondary lbh-button--secondary lbh-button--inline"
                    href={`/applications/edit/${applicationId}/${applicant.person?.id}/edit-household-member`}
                    dataTestId={`test-edit-household-member-button-${applicant.person?.id}`}
                  >
                    Edit
                  </ButtonLink>
                )}
                <ButtonLink
                  additionalCssClasses="lbh-button--inline"
                  href={`/applications/view/${applicationId}/${applicant.person?.id}`}
                >
                  View
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
