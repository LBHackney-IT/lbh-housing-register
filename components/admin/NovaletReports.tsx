import { useState, MouseEvent } from 'react';
import Button, { ButtonLink } from '../button';
import { generateNovaletExport } from '../../lib/gateways/internal-api';
import { Report } from './../../pages/applications/reports';
import Paragraph from '../content/paragraph';
import Announcement from '../announcement';
import AnnouncementText from '../form/announcement-text';

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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNovaletExport = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsGenerating(true);
    generateNovaletExport();
  };

  return reports.length > 0 ? (
    <>
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
          {reports.map((report: Report) => (
            <tr key={report.fileName} className="govuk-table__row">
              <td className="govuk-table__cell">
                <p className="lbh-body lbh-!-font-weight-bold">
                  {report.fileName}
                </p>
                <p className="lbh-!-margin-top-0">
                  {generatedDateTimeString(report.lastModified)}
                </p>
              </td>
              <td className="govuk-table__cell">
                <ButtonLink
                  additionalCssClasses="lbh-!-margin-top-0 lbh-!-no-wrap"
                  secondary={true}
                  href={`/api/reports/novalet/download/${encodeURIComponent(
                    report.fileName
                  )}`}
                >
                  Download CSV
                </ButtonLink>
              </td>
              <td className="govuk-table__cell">
                <ButtonLink
                  additionalCssClasses="lbh-!-margin-top-0 lbh-!-no-wrap"
                  href={`/api/reports/novalet/approve/${encodeURIComponent(
                    report.fileName
                  )}`}
                >
                  Sync to Novalet
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        disabled={isGenerating}
        onClick={() => handleGenerateNovaletExport}
      >
        Generate file
      </Button>
      {isGenerating ? (
        <Announcement variant="success">
          <Paragraph>
            A new applicant feed is being generated and is usually available
            within in 2-3 minutes.
          </Paragraph>
        </Announcement>
      ) : null}
    </>
  ) : (
    <div></div>
  );
}
