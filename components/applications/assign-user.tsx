import { useState } from 'react';
import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import Button from '../button';

interface AssignUserProps {
  id: string;
  user?: string;
}

export default function AssignUser({ id, user }: AssignUserProps): JSX.Element {
  const [assignedTo, setAssignedTo] = useState(user);

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
  };

  return (
    <>
      <label className="govuk-label lbh-label" htmlFor="input-assignee">
        <strong>Assigned to</strong>
      </label>
      <input
        className="govuk-input lbh-input"
        id="input-assignee"
        name="assignedTo"
        type="text"
        value={assignedTo}
        onChange={textChangeHandler}
      />
      <Button onClick={() => assignTo()} secondary={true}>
        Assign
      </Button>
    </>
  );
}
