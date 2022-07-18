import React, { useState } from 'react';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { diff } from 'nested-object-diff';
import * as Yup from 'yup';
import {
  ActivityEntity,
  ActivityHistoryPagedResult,
  ActivityHistoryResponse,
  ApplicationActivityType,
  ApplicationActivityData,
  IActivityEntity,
} from '../../domain/ActivityHistoryApi';
import { ApplicationStatus } from '../../lib/types/application-status';
import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../summary-list';
import { HeadingThree, HeadingFour } from '../content/headings';
import { addNoteToHistory } from '../../lib/gateways/internal-api';
import Textarea from '../form/textarea';
import Button from '../button';
import router from 'next/router';
import Details from '../details';
import loadConfig from 'next/dist/next-server/server/config';
import Paragraph from '../content/paragraph';

interface ActivityHistoryPageProps {
  history: ActivityHistoryPagedResult;
  id: string;
}

export default function ApplicationHistory({
  history,
  id,
}: ActivityHistoryPageProps): JSX.Element | null {
  const initialValues: FormikValues = {
    note: '',
  };

  const addNoteSchema = Yup.object({
    note: Yup.string().label('Note').required(),
  });

  const listItems = history
    ? history.results.map((historyItem, index) => {
        const heading = renderHeading(historyItem);
        const body = renderBody(historyItem);
        const createdAt = getFormattedDate(historyItem.createdAt);

        return (
          <li
            key={historyItem.id}
            className={`lbh-timeline__event ${
              history.results.length - 1 !== index
                ? 'lbh-timeline__event--major'
                : ''
            }`}
          >
            <HeadingFour content={heading as string} />
            <p className="lbh-body lbh-body--grey lbh-!-margin-top-0">
              {createdAt}
            </p>
            {body}
          </li>
        );
      })
    : null;

  const onSubmit = (values: FormikValues) => {
    addNoteToHistory(id, { Note: values.note }).then(() => {
      router.reload();
    });
  };

  return (
    <>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListKey>
            <HeadingThree content="Add a note" />
          </SummaryListKey>
          <SummaryListValue>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={addNoteSchema}
            >
              {({ isSubmitting, errors, isValid }) => {
                return (
                  <>
                    <Form>
                      <Textarea name="note" label="" as="textarea" />
                      <Button disabled={isSubmitting} type="submit">
                        Save note
                      </Button>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </SummaryListValue>
        </SummaryListRow>
      </SummaryListNoBorder>
      {listItems ? (
        <>
          <SummaryListNoBorder>
            <SummaryListRow>
              <SummaryListKey>
                <HeadingThree content="History" />
              </SummaryListKey>
              <SummaryListValue>
                <ol className="lbh-timeline">{listItems}</ol>
              </SummaryListValue>
            </SummaryListRow>
          </SummaryListNoBorder>
        </>
      ) : (
        <HeadingThree content="No history to show" />
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
    [ApplicationActivityType.NoteAddedByUser]: noteAddedByUser,
    [ApplicationActivityType.ImportedFromLegacyDatabase]:
      importedFromLegacyDatabase,
    [ApplicationActivityType.MainApplicantChangedByUser]:
      mainApplicantChangedByUser,
  };

  const functionDelegate =
    activityText[capitalizeFirstLetter(historyItem.activityType)];

  if (functionDelegate) {
    return functionDelegate(historyItem);
  }
}

function renderBody(item: ActivityHistoryResponse) {
  const historyItem = new ActivityEntity(item);

  if (!historyItem.newData.activityData) {
    const differences = diff(historyItem.newData, historyItem.oldData);

    interface Difference {
      type: string;
      path: string;
      lhs: any;
      rhs: any;
    }

    return (
      <Details summary="Show details">
        <>
          <table className="govuk-table lbh-table lbh-table--small">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th className="govuk-table__header">Field</th>
                <th className="govuk-table__header">New value</th>
                <th className="govuk-table__header">Old value</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {differences.map((difference: Difference, index: number) => {
                let { path, lhs, rhs } = difference;

                if (typeof rhs === 'object' || typeof lhs === 'object') {
                  lhs = JSON.stringify(lhs);
                  rhs = JSON.stringify(rhs);
                }
                if (path != 'person.id') {
                  return (
                    <tr key={index} className="govuk-table__row">
                      <td className="govuk-table__cell">{path}</td>
                      <td className="govuk-table__cell lbh-!-break-word">
                        {lhs}
                      </td>
                      <td className="govuk-table__cell lbh-!-break-word">
                        {rhs}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </>
      </Details>
    );
  }

  if (!historyItem.newData.activityData) return false;

  return (
    <Details summary="Show details">{historyItem.newData.activityData}</Details>
  );
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

const noteAddedByUser = (activity: IActivityEntity) => {
  return <>Note added by {activity.authorDetails.fullName}</>;
};

const importedFromLegacyDatabase = () => {
  return <>Imported from legacy database</>;
};

const mainApplicantChangedByUser = (activity: IActivityEntity) => {
  return <>Main applicant changed</>;
};

function capitalizeFirstLetter(string: any) : ApplicationActivityType {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
