import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Application, APPLICATION_UNNASIGNED } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';

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

  const textChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ChangeEvent<HTMLInputElement> => {
    setAssignedTo(event.target.value);
    return event;
  };

  const assignTo = async () => {
    const request: Application = {
      id: id,
      assignedTo: assignedTo,
    };
    updateApplication(request);
    router.push(`/applications/view/${id}`);
  };

  return (
    <div>
      <label className="govuk-label lbh-label" htmlFor="input-assignee">
        <ul className="lbh-list lbh-list--compressed">
          <li>
            <strong>Assigned to</strong>
          </li>
          <li>
            {!user.hasAdminPermissions &&
              !user.hasManagerPermissions &&
              assignedTo}
          </li>
        </ul>
      </label>
      {(user.hasAdminPermissions || user.hasManagerPermissions) && (
        <>
          <input
            className="govuk-input lbh-input"
            id="input-assignee"
            name="assignedTo"
            type="text"
            value={assignedTo !== APPLICATION_UNNASIGNED ? assignedTo : ''}
            onChange={textChangeHandler}
          />
          <button
            onClick={() => assignTo()}
            className="lbh-link lbh-link--no-visited-state"
            style={{ marginTop: '0.3em' }}
          >
            Assign
          </button>
        </>
      )}
    </div>
  );
}
