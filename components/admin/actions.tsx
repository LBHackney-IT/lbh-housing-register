import router from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';

import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { ApplicationStatus } from '../../lib/types/application-status';
import { checkEligible } from '../../lib/utils/form';
import { getDisqualificationReasonOption } from '../../lib/utils/disqualificationReasonOptions';
import {
  reasonInitialValue,
  statusOptions,
  reasonOptions,
} from '../../lib/utils/assessmentActionsData';

import Button from '../button';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import Select from '../form/select';
import Radios from '../form/radios';
import Input from '../form/input';
import InsetText from '../content/inset-text';
import Paragraph from '../content/paragraph';
import List, { ListItem } from '../content/list';
import ErrorSummary from '../errors/error-summary';
import Loading from '../loading';
import Announcement from '../announcement';

interface PageProps {
  data: Application;
}

export default function Actions({ data }: PageProps): JSX.Element {
  const isEligible = checkEligible(data);
  const wasDisqualified = isEligible[0] === false;
  const disqualificationReasons = wasDisqualified ? isEligible[1] : [];
  const firstReason = disqualificationReasons[0];
  const formRef = useRef<FormikProps<FormikValues>>(null);

  const schema = Yup.object({
    status: Yup.string()
      .label('Status')
      .required()
      .oneOf(statusOptions.map(({ value }) => value)),
    reason: Yup.string()
      .label('Reason')
      .oneOf(reasonOptions.map(({ value }) => value)),
    applicationDate: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    informationReceived: Yup.string().notOneOf([INVALID_DATE], 'Invalid date'),
    bedroomNeed: Yup.number()
      .typeError('Bedroom need should be a number')
      .label('Bedroom need')
      .test(
        'aboveZero',
        'Bedroom need should be a number greater than 0',
        (value, testContext) => {
          if (
            testContext.parent.status !== ApplicationStatus.ACTIVE &&
            testContext.parent.status !== ApplicationStatus.ACTIVE_UNDER_APPEAL
          ) {
            return true;
          }

          if (typeof value !== 'number') {
            return false;
          }

          if (
            (testContext.parent.status === ApplicationStatus.ACTIVE &&
              value < 1) ||
            (testContext.parent.status ===
              ApplicationStatus.ACTIVE_UNDER_APPEAL &&
              value < 1)
          ) {
            return false;
          }
          return true;
        }
      ),
    band: Yup.string(),
    biddingNumberType: Yup.string().oneOf(['generate', 'manual']),
    biddingNumber: Yup.string().matches(
      /^\d{7}$/,
      'Bidding number should be a 7 digit number'
    ),
  });

  const initialValues = {
    status: data.status ?? '',
    reason: data.assessment?.reason ?? reasonInitialValue(firstReason),
    applicationDate: data.assessment?.effectiveDate ?? data.submittedAt ?? '',
    informationReceived: data.assessment?.informationReceivedDate ?? '',
    bedroomNeed:
      data.assessment?.bedroomNeed ?? data.calculatedBedroomNeed! ?? '',
    band: data.assessment?.band ?? '',
    biddingNumberType: data.assessment?.biddingNumber ? 'manual' : 'generate',
    biddingNumber: data.assessment?.biddingNumber ?? '',
  };

  function showDecisionOptions(values: FormikValues): boolean {
    return (
      values.status === ApplicationStatus.ACTIVE ||
      values.status === ApplicationStatus.ACTIVE_UNDER_APPEAL
    );
  }

  function showInformationReceived(values: FormikValues): boolean {
    return (
      values.status === ApplicationStatus.ACTIVE ||
      values.status === ApplicationStatus.ACTIVE_UNDER_APPEAL ||
      values.status === ApplicationStatus.REJECTED ||
      values.status === ApplicationStatus.CANCELLED
    );
  }

  function onSubmit(values: FormikValues) {
    const request: Application = {
      id: data.id,
      status: values.status,
      assessment: {
        reason: values.reason,
      },
    };

    if (values.applicationDate && request.assessment) {
      request.assessment.effectiveDate = values.applicationDate;
    }
    if (values.informationReceived && request.assessment) {
      request.assessment.informationReceivedDate = values.informationReceived;
    }

    if (showDecisionOptions(values) && request.assessment) {
      request.assessment.bedroomNeed = +values.bedroomNeed;
      request.assessment.band = values.band;
      request.assessment.biddingNumber = values.biddingNumber;
      request.assessment.generateBiddingNumber =
        values.biddingNumberType === 'generate';
    }

    updateApplication(request)
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        alert(err);
        if (formRef.current) {
          formRef.current.setSubmitting(false);
        }
      });
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        {wasDisqualified ? (
          <Announcement variant="info">
            <h3 className="lbh-page-announcement__title">
              The applicant was rejected by the system based on the following
              reason/s:
            </h3>
            <div className="lbh-page-announcement__content">
              <List>
                {disqualificationReasons.map((reason, index) => (
                  <ListItem key={index}>
                    {getDisqualificationReasonOption(reason)}
                  </ListItem>
                ))}
              </List>
            </div>
          </Announcement>
        ) : (
          <Paragraph>
            The applicant was deemed to be eligible by the system.
          </Paragraph>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ touched, isSubmitting, values, errors, isValid }) => {
            const isTouched = Object.keys(touched).length !== 0;
            return (
              <>
                {(!isValid && isTouched && !isSubmitting) ||
                reservedBiddingNumberError ? (
                  <ErrorSummary title="There is a problem">
                    <ul className="govuk-list govuk-error-summary__list">
                      {Object.entries(errors).map(([inputName, errorTitle]) => (
                        <li key={inputName}>
                          <a href={`#${inputName}`}>{errorTitle}</a>
                        </li>
                      ))}
                      <li>
                        {reservedBiddingNumberError ? (
                          <a href="#biddingNumber">
                            {reservedBiddingNumberError}
                          </a>
                        ) : null}
                      </li>
                    </ul>
                  </ErrorSummary>
                ) : null}
                {isSubmitting ? (
                  <Loading text="Updating assessment status…" />
                ) : (
                  <Form aria-disabled={isSubmitting}>
                    <Select
                      label="Status"
                      name="status"
                      options={statusOptions}
                    />
                    <Select
                      label="Reason"
                      name="reason"
                      options={reasonOptions}
                    />
                    <DateInput
                      name={'applicationDate'}
                      label={'Application date'}
                    />
                    {showInformationReceived(values) && (
                      <DateInput
                        name={'informationReceived'}
                        label={'All information received'}
                      />
                    )}
                    {showDecisionOptions(values) && (
                      <>
                        <Input
                          name="bedroomNeed"
                          label="Bedroom need"
                          className="govuk-input--width-2"
                        />
                        <Radios
                          label="Band"
                          name="band"
                          options={[
                            { label: 'Band A', value: 'A' },
                            { label: 'Band B', value: 'B' },
                            { label: 'Band C', value: 'C' },
                            {
                              label: 'Band C (transitional)',
                              value: 'C-transitional',
                            },
                          ]}
                        />

                        <Radios
                          label="Bidding number"
                          name="biddingNumberType"
                          options={[
                            {
                              label: 'Generate bidding number',
                              value: 'generate',
                            },
                            {
                              label: 'Use existing bidding number',
                              value: 'manual',
                            },
                          ]}
                        />
                        {values.biddingNumberType === 'manual' && (
                          <InsetText>
                            <Input
                              name="biddingNumber"
                              label="Bidding number (existing)"
                              className="govuk-input--width-10"
                            />
                          </InsetText>
                        )}
                      </>
                    )}
                    <Button disabled={isSubmitting} type="submit">
                      Save changes
                    </Button>
                  </Form>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
