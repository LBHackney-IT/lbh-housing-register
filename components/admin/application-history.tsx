import React from 'react';
import Paragraph from '../content/paragraph';
import {
  ActivityEntity,
  ActivityHistoryPagedResult,
  ActivityHistoryResponse,
  ApplicationActivityType,
  IActivityEntity,
} from '../../domain/ActivityHistoryApi';
import { ApplicationStatus } from '../../lib/types/application-status';
import { date } from 'yup';

interface ActivityHistoryPageProps {
  history: ActivityHistoryPagedResult;
}

export default function ApplicationHistory({
  history,
}: ActivityHistoryPageProps): JSX.Element | null {
  const listItems = history
    ? history.results.map((historyItem) => {
      const heading = renderHeading(historyItem);
      const createdAt = getFormattedDate(historyItem.createdAt);

      return (
        <li key={historyItem.id} className="lbh-body-xs">
          <strong>{heading}</strong>
          <br></br>
          {createdAt}
        </li>
      );
    })
    : null;

  return (
    <>
      {listItems ? (
        <>
          <ul>{listItems}</ul>
        </>
      ) : (
        <Paragraph>No history to show</Paragraph>
      )}
    </>
  );
}

function renderHeading(item: ActivityHistoryResponse) {
  const historyItem = new ActivityEntity(item);

  const activityText: {
    [key in ApplicationActivityType]: (activity: IActivityEntity) => {};
  } = {
    [ApplicationActivityType.AssignedToChangedByUser]: assignedToChangedByUser,
    [ApplicationActivityType.BedroomNeedChangedByUser]:
      bedroomNeedChangedByUser,
    [ApplicationActivityType.CaseViewedByUser]: caseViewedByUser,
    [ApplicationActivityType.EffectiveDateChangedByUser]:
      effectiveDateChangedByUser,
    [ApplicationActivityType.SensitivityChangedByUser]:
      sensitivityChangedByUser,
    [ApplicationActivityType.StatusChangedByUser]: statusChangedByUser,
    [ApplicationActivityType.SubmittedByResident]: submittedByResident,
  };

  const functionDelegate = activityText[historyItem.activityType];

  if (functionDelegate) {
    return functionDelegate(historyItem);
  }
}

const getFormattedDate = (
  dateString: string | null,
  excludeTime: boolean = false
) => {
  if (dateString == null) {
    return '';
  }

  let options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  if (excludeTime) {
    options = { year: 'numeric', month: 'short', day: 'numeric' };
  }

  const dateFormat = new Date(dateString).toLocaleString('en-GB', options);
  return dateFormat;
};

const assignedToChangedByUser = (activity: IActivityEntity) => {
  return (
    <>
      Assigned to '${activity.newData.assignedTo}' by $
      {activity.oldData.assignedTo}
    </>
  );
};

const bedroomNeedChangedByUser = (activity: IActivityEntity) => {
  return (
    <>
      Bedroom need changed from '{activity.oldData.assessment?.bedroomNeed}' to
      '{activity.newData.assessment?.bedroomNeed}' by{' '}
      {activity.authorDetails.fullName}
    </>
  );
};

const caseViewedByUser = (activity: IActivityEntity) => {
  return <>Case viewed by {activity.authorDetails.fullName}</>;
};

const effectiveDateChangedByUser = (activity: IActivityEntity) => {
  return (
    <>
      Application date changed from '
      {getFormattedDate(
        activity.oldData.assessment?.effectiveDate ?? null,
        true
      )}
      ' to '
      {getFormattedDate(
        activity.newData.assessment?.effectiveDate ?? null,
        true
      )}
      ' by {activity.authorDetails.fullName}
    </>
  );
};

const sensitivityChangedByUser = (activity: IActivityEntity) => {
  return <>Marked as sensitive by {activity.authorDetails.fullName}</>;
};

const submittedByResident = (activity: IActivityEntity) => {
  return <>Application submitted by {activity.authorDetails.fullName}</>;
};

const statusChangedByUser = (activity: IActivityEntity) => {
  let message = (
    <>
      Status changed from '{activity.oldData.status}' to '
      {activity.newData.status}' by {activity.authorDetails.fullName}
      <br></br> Reason: '{activity.newData.assessment?.reason}'
    </>
  );

  if (activity.newData.status == ApplicationStatus.ACTIVE) {
    message = (
      <>
        Case activated in band with reason: '
        {activity.newData.assessment?.reason}' by{' '}
        {activity.authorDetails.fullName}
      </>
    );
  } else if (activity.newData.status == ApplicationStatus.REJECTED) {
    // Just a place holder, we need to distinuish between user and system rejection
    message = (
      <>
        Case automatically rejected by system with reason: '
        {activity.newData.assessment?.reason}'
      </>
    );
  }

  return message;
};
