import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { APPLICATION_UNNASIGNED, Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';
import ErrorMessage from '../form/error-message';

interface AssignUserProps {
  id: string;
  user: HackneyGoogleUserWithPermissions;
  assignee?: string;
}

export default function AssignUser({
  id,
  user,
  assignee,
}: AssignUserProps): JSX.Element {
  const router = useRouter();
  const [assignedTo, setAssignedTo] = useState(assignee);
  const [showControls, setShowControls] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [disableControls, setDisableControls] = useState(false);

  const handleAssigneeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !/^[^@]+@[^@]+\.[^@]+$/.test(event.target.value) &&
      event.target.value !== ''
    ) {
      setIsValidEmail(false);
    } else {
      setIsValidEmail(true);
    }
    setAssignedTo(event.target.value);
  };

  const updateAssignee = async (updateTo: string | undefined) => {
    if (!isValidEmail || assignedTo === '') {
      return;
    }

    setDisableControls(true);

    const request: Application = {
      id,
      assignedTo: updateTo,
    };
    await updateApplication(request).then(() => {
      router.reload();
    });
  };

  const handleClickAssignToAnother = (isOpen: boolean) => {
    setShowControls(isOpen);

    if (isOpen) {
      setAssignedTo('');
      setIsValidEmail(true);
    }
  };

  return (
    <div>
      <label className="govuk-label lbh-label" htmlFor="input-assignee">
        <ul className="lbh-list lbh-list--compressed">
          <li>
            <strong>Assigned to</strong>
          </li>
          {!showControls ? (
            <>
              {assignee !== APPLICATION_UNNASIGNED ? (
                <li>
                  This application is currently assigned to{' '}
                  {assignedTo === user.email ? (
                    <>
                      <span>you</span> (<strong>{assignee}</strong>)
                    </>
                  ) : (
                    <strong>{assignee}</strong>
                  )}
                </li>
              ) : (
                <li>
                  This application is currently <strong>unassigned</strong>
                </li>
              )}
            </>
          ) : null}
        </ul>
      </label>

      {showControls ? (
        <>
          <ErrorMessage
            message={!isValidEmail ? 'Please enter a valid email address' : ''}
          />
          <input
            className="govuk-input lbh-input lbh-!-margin-top-1"
            id="input-assignee"
            name="assignedTo"
            type="text"
            value={assignedTo !== APPLICATION_UNNASIGNED ? assignedTo : ''}
            onChange={handleAssigneeChange}
            placeholder="Enter email address"
            disabled={disableControls}
          />
          <button
            onClick={() => updateAssignee(assignedTo)}
            className="lbh-button lbh-button--secondary lbh-!-margin-top-1"
            disabled={disableControls}
          >
            Assign
          </button>
          <button
            onClick={() => handleClickAssignToAnother(false)}
            className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-0 lbh-!-margin-left-1"
            disabled={disableControls}
          >
            Cancel
          </button>
        </>
      ) : // For now, allow all user groups to reassign cases
      user.hasAdminPermissions ||
        user.hasManagerPermissions ||
        user.hasOfficerPermissions ? (
        <>
          <button
            onClick={() => handleClickAssignToAnother(true)}
            className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-1"
            disabled={disableControls}
          >
            Assign to another officer
          </button>

          {assignee === APPLICATION_UNNASIGNED || assignee === user.email ? (
            <span className="lbh-body-m"> or </span>
          ) : (
            <span className="lbh-body-m">, </span>
          )}

          {assignee !== user.email ? (
            <button
              onClick={() => updateAssignee(user.email)}
              className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-0"
              disabled={disableControls}
            >
              assign to me
            </button>
          ) : null}

          {assignee !== APPLICATION_UNNASIGNED && assignee !== user.email ? (
            <span className="lbh-body-m"> or </span>
          ) : null}

          {assignee !== APPLICATION_UNNASIGNED ? (
            <button
              onClick={() => updateAssignee(APPLICATION_UNNASIGNED)}
              className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-0"
              disabled={disableControls}
            >
              unassign
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
