import React, { useState } from 'react';

import { Form, Formik, FormikValues } from 'formik';
import router from 'next/router';
import * as Yup from 'yup';

import { ActivityHistoryPagedResult } from '../../domain/ActivityHistoryApi';
import { addNoteToHistory } from '../../lib/gateways/internal-api';
import { toUserErrorMessage } from '../../lib/utils/errorHelper';
import Button from '../button';
import { HeadingFour, HeadingThree } from '../content/headings';
import ErrorSummary from '../errors/error-summary';
import Textarea from '../form/textarea';
import {
  SummaryListKey,
  SummaryListNoBorder,
  SummaryListRow,
  SummaryListValue,
} from '../summary-list';
import {
  getFormattedDate,
  renderBody,
  renderHeading,
} from './utils/ApplicationHistoryHelpers';

interface ActivityHistoryPageProps {
  history: ActivityHistoryPagedResult;
  id: string;
  showDetails?: boolean;
}

export default function ApplicationHistory({
  history,
  id,
  showDetails,
}: ActivityHistoryPageProps): JSX.Element | null {
  const initialValues: FormikValues = {
    note: '',
  };

  const [userError, setUserError] = useState<string | undefined>(undefined);

  const addNoteSchema = Yup.object({
    note: Yup.string().label('Note').required(),
  });

  const listItems = history
    ? history.results.map((historyItem, index) => {
        const heading = renderHeading(historyItem) as unknown;
        const body = showDetails ? renderBody(historyItem) : null;
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
    setUserError(undefined);

    return addNoteToHistory(id, { Note: values.note })
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        setUserError(toUserErrorMessage(error, 'Unable to add note'));
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
              {({ isSubmitting }) => {
                return (
                  <Form>
                    {userError ? (
                      <ErrorSummary dataTestId="test-add-note-error-summary">
                        {userError}
                      </ErrorSummary>
                    ) : null}
                    <Textarea name="note" label="" as="textarea" />
                    <Button disabled={isSubmitting} type="submit">
                      Save note
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </SummaryListValue>
        </SummaryListRow>
      </SummaryListNoBorder>
      {listItems ? (
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
      ) : (
        <HeadingThree content="No history to show" />
      )}
    </>
  );
}
