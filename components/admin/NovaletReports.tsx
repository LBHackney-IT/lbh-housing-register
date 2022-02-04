import Link from 'next/link';
import Button, { ButtonLink } from '../button';
import {
  generateNovaletExport,
  approveNovaletExport,
} from '../../lib/gateways/internal-api';
import { Report } from './../../pages/applications/reports';

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
  console.log(reports);

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
                {/* <Button
                  className="lbh-!-margin-top-0 lbh-!-no-wrap"
                  onClick={() => approveNovaletExport(report.fileName)}
                >
                  Sync to Novalet
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={generateNovaletExport}>Generate file</Button>
    </>
  ) : (
    <div></div>
  );
}
