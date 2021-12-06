import React from 'react';
import Button, { ButtonLink } from '../../../components/button';
import {
  generateNovaletExport,
  approveNovaletExport,
  deleteNovaletExport,
} from '../../../lib/gateways/internal-api';

interface NovaletReportsProps {
  reports: NovaletReportFile[];
}

interface NovaletReportFile {
  fileName: string;
  lastModified: string;
  size: number;
  attributes: NovaletReportFileAttributes;
}

interface NovaletReportFileAttributes {
  approvedOn: string;
  approvedBy: string;
  lastDownloadedOn : string;  
  transferredOn : string;
}

export default function NovaletReports({
  reports,
}: NovaletReportsProps): JSX.Element {
  const formatDate = (isoDateString: string) => {
    const dateOptions: any = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    const timeOptions: any = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const date = new Date(isoDateString);
    const dateField = date.toLocaleString('en-GB', dateOptions).toString();
    const timeField = date.toLocaleString('en-GB', timeOptions).toString();
    return `${dateField} at ${timeField}`;
  };

  const isDate = (isoDateString: string) => {
    var date = new Date(isoDateString);
    return !isNaN(date.getDate());
  };

  const approvedOnContent = (report : NovaletReportFile) => {
    if (isDate(report.attributes.approvedOn)) {
      return (<>Approved on {formatDate(report.attributes.approvedOn)} by {report.attributes.approvedBy}</>)
    }else
    {
      return (<>Not yet Approved</>)
    }
  }

  const downloadedOnContent = (report : NovaletReportFile) => {
    if (isDate(report.attributes.lastDownloadedOn)) {
      return (<>Downloaded on {formatDate(report.attributes.lastDownloadedOn)}</>)
    }else
    {
      return (<>Not yet Downloaded</>)
    }
  }

  const regenerateContent = (report : NovaletReportFile) => {
    if (isDate(report.attributes.transferredOn)) {
      return (<a onClick={() => deleteNovaletExport(report.fileName)} href="">Delete</a>)
    }else
    {
      return (<a onClick={generateNovaletExport} href="">Regenerate</a>)
    }
  }

  return (
    <div className="lbh-body">
      <div className="govuk-grid-row">
        <div
          className="govuk-grid-column-two-quarters"
          style={{ width: '50%', float: 'left' }}
        >
          Report
        </div>
        <div className="govuk-grid-column-one-quarter">Download</div>
        <div className="govuk-grid-column-one-quarter">Sync</div>
      </div>
      {reports && reports.length > 0 ? (
        <>
          {reports.map((report: NovaletReportFile) => (
            <div key={report.fileName} className="govuk-grid-row">
              <div
                className="govuk-grid-column-two-quarters"
                style={{ width: '50%', float: 'left' }}
              >
                <p className="lbh-body--bold lbh-!-margin-top-0">
                  {report.fileName}
                </p>
                <p className="lbh-body--grey govuk-body-xs govuk-!-margin-bottom-0">
                  Generated on {formatDate(report.lastModified)}
                </p>
                <p className="lbh-body--grey govuk-body-xs govuk-!-margin-bottom-0">
                  {approvedOnContent(report)}                  
                </p>
                <p className="lbh-body--grey govuk-body-xs govuk-!-margin-bottom-0">
                  {downloadedOnContent(report)}
                </p>
                {regenerateContent(report)}
              </div>

              <div className="govuk-grid-column-one-quarter">
                <ButtonLink
                  small
                  secondary
                  href={`/api/reports/novalet/download/${report.fileName}`}
                >
                  Download CSV
                </ButtonLink>
              </div>

              <div className="govuk-grid-column-one-quarter">
                <Button
                  small
                  secondary
                  onClick={() => approveNovaletExport(report.fileName)}
                  disabled={isDate(report.attributes?.approvedOn)}
                >
                  {isDate(report.attributes?.approvedOn) ? "Approved" : "Sync To Novalet"} 
                </Button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
