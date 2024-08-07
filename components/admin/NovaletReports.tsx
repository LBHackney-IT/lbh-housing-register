import { useState } from 'react';

import {
  approveNovaletExport,
  generateNovaletExport,
} from '../../lib/gateways/internal-api';
import { Report } from '../../pages/applications/reports';
import Announcement from '../announcement';
import Button, { ButtonLink } from '../button';
import { HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import Dialog from '../dialog';

interface NovaletReportsProps {
  reports: Report[];
}

const generatedDateTimeString = (ISODate: string) => {
  const date = new Date(ISODate);
  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `Generated on ${formattedDate} at ${formattedTime}`;
};

export default function NovaletReports({
  reports,
}: NovaletReportsProps): JSX.Element {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Make sure we're not confusing our "WITH-URL" file with the applicant feed
  const applicantFeeds = reports.filter(
    (report: Report) => !report.fileName.includes('WITH-URL')
  );

  const newestToOldestReports = applicantFeeds.sort((a, b) => {
    if (a.lastModified < b.lastModified) return 1;
    if (a.lastModified > b.lastModified) return -1;
    return 0;
  });

  const tenLatestReports = newestToOldestReports.slice(0, 10);

  /*
   * Creates an array of reports where
   * the CSV's contianing URLS are included
   * as a link with the applicant feed item.
   *
   * This is a short term solution as currently officers
   * are struggling to find applications in the system due
   * to the lack of search functionality.
   */
  const groupedReports = tenLatestReports.map((report) => {
    const fileNameWithUrl = report.fileName.replace('FEED', 'FEED-WITH-URL');

    return {
      ...report,
      applicationLinksFileName: fileNameWithUrl,
    };
  });

  const [mostRecentReport, ...previousReports] = groupedReports;

  const syncToNovalet = async () => {
    approveNovaletExport(mostRecentReport.fileName);
    setIsSyncing(true);
    setConfirmDialogOpen(false);
  };

  const handleGenerateNovaletExport = async () => {
    generateNovaletExport();
    setIsGenerating(true);
  };

  return (
    <>
      {reports.length > 0 ? (
        <>
          <HeadingTwo content="Most recent report" />
          <table className="govuk-table lbh-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">
                  Report
                </th>
                <th scope="col" className="govuk-table__header">
                  Download
                </th>
                <th scope="col" className="govuk-table__header">
                  Sync
                </th>
              </tr>
            </thead>

            <tbody className="govuk-table__body">
              <tr key={mostRecentReport.fileName} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <p className="lbh-body lbh-!-font-weight-bold">
                    {mostRecentReport.fileName}
                  </p>
                  <p className="lbh-body-s lbh-!-margin-top-0">
                    {generatedDateTimeString(mostRecentReport.lastModified)}
                  </p>
                  {mostRecentReport.applicationLinksFileName ? (
                    <p className="lbh-!-margin-top-0 lbh-body-s">
                      <a
                        className="lbh-link"
                        href={`/api/reports/novalet/download/${encodeURIComponent(
                          mostRecentReport.applicationLinksFileName
                        )}`}
                      >
                        Download CSV with application links
                      </a>
                    </p>
                  ) : null}
                </td>
                <td className="govuk-table__cell">
                  <ButtonLink
                    additionalCssClasses="lbh-!-margin-top-0 lbh-!-no-wrap"
                    secondary
                    href={`/api/reports/novalet/download/${encodeURIComponent(
                      mostRecentReport.fileName
                    )}`}
                  >
                    Download CSV
                  </ButtonLink>
                </td>
                <td className="govuk-table__cell">
                  <Button
                    disabled={isSyncing}
                    className="lbh-!-margin-top-0"
                    onClick={() => setConfirmDialogOpen(true)}
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>

          <Dialog
            isOpen={confirmDialogOpen}
            title="Clicking the button below will sync the most recent report to novalet"
            onCancel={() => setConfirmDialogOpen(false)}
            onCancelText="Cancel"
          >
            <p className="lbh-body lbh-!-margin-top-1">
              Ensure you have reviewed{' '}
              <a
                className="lbh-link"
                href={`/api/reports/novalet/download/${encodeURIComponent(
                  mostRecentReport.fileName
                )}`}
              >
                {mostRecentReport.fileName}
              </a>{' '}
              before sending.
            </p>
            <Button disabled={isSyncing} onClick={() => syncToNovalet()}>
              Sync to Novalet
            </Button>
          </Dialog>
        </>
      ) : (
        <HeadingTwo content="No reports to show" />
      )}
      {isSyncing ? (
        <Announcement variant="success">
          <Paragraph>
            The applicant feed {mostRecentReport.fileName} has been synced to
            Novalet.
          </Paragraph>
        </Announcement>
      ) : null}

      <Button
        disabled={isGenerating}
        onClick={() => handleGenerateNovaletExport()}
      >
        Generate a new report
      </Button>
      {isGenerating ? (
        <Announcement variant="success">
          <Paragraph>
            A new applicant feed is being generated and is usually available
            within in 2-3 minutes.
          </Paragraph>
        </Announcement>
      ) : null}

      {reports.length > 1 ? (
        <>
          <HeadingTwo content="Previous reports" />
          <table className="govuk-table lbh-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">
                  Report
                </th>
                <th scope="col" className="govuk-table__header">
                  Download
                </th>
              </tr>
            </thead>

            <tbody className="govuk-table__body">
              {previousReports.map((report: Report) => (
                <tr key={report.fileName} className="govuk-table__row">
                  <td className="govuk-table__cell">
                    <p className="lbh-body lbh-!-font-weight-bold">
                      {report.fileName}
                    </p>
                    <p className="lbh-body-s lbh-!-margin-top-0">
                      {generatedDateTimeString(report.lastModified)}
                    </p>
                    {report.applicationLinksFileName ? (
                      <p className="lbh-!-margin-top-0 lbh-body-s">
                        <a
                          className="lbh-link"
                          href={`/api/reports/novalet/download/${encodeURIComponent(
                            report.applicationLinksFileName
                          )}`}
                        >
                          Download CSV with application links
                        </a>
                      </p>
                    ) : null}
                  </td>
                  <td className="govuk-table__cell">
                    <ButtonLink
                      additionalCssClasses="lbh-!-margin-top-0 lbh-!-no-wrap"
                      secondary
                      href={`/api/reports/novalet/download/${encodeURIComponent(
                        report.fileName
                      )}`}
                    >
                      Download CSV
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </>
  );
}
