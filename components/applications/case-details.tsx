import React from 'react';
import { Application } from '../../domain/HousingApi';
import { HeadingThree } from '../content/headings';
import Paragraph from '../content/paragraph';
import { formatDate } from './application-table';

interface CaseDetailsProps {
  application: Application;
}

export default function CaseDetails({
  application,
}: CaseDetailsProps): JSX.Element {
  return (
    <>
      <HeadingThree content="Case details" />
      <Paragraph>
        <strong>Application reference</strong>
        <br />
        {application.reference}
      </Paragraph>
      {application.assessment?.biddingNumber && (
        <Paragraph>
          <strong>Bidding number</strong>
          <br />
          {application.assessment?.biddingNumber}
        </Paragraph>
      )}
      <Paragraph>
        <strong>Status</strong>
        <br />
        {application.status}
      </Paragraph>
      {application.submittedAt && (
        <Paragraph>
          <strong>Date submitted</strong>
          <br />
          {formatDate(application.submittedAt)}
        </Paragraph>
      )}
      {application.assessment?.effectiveDate && (
        <Paragraph>
          <strong>Application date</strong>
          <br />
          {formatDate(application.assessment?.effectiveDate)}
        </Paragraph>
      )}
      {application.assessment?.band && (
        <Paragraph>
          <strong>Band</strong>
          <br />
          Band {application.assessment?.band}
        </Paragraph>
      )}
    </>
  );
}
