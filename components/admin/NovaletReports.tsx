import Link from 'next/link';
import Button, { ButtonLink } from '../button';
// import { generateNovaletExport } from '../../../lib/gateways/internal-api';
import {
  generateNovaletExport,
  approveNovaletExport,
} from '../../lib/gateways/applications-api';
import { Report } from './../../pages/applications/reports';

interface NovaletReportsProps {
  reports: Report[];
}

export default function NovaletReports({
  reports,
}: NovaletReportsProps): JSX.Element {
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
          {reports.map((report: any) => (
            <tr key={report.fileName} className="govuk-table__row">
              <th scope="row" className="govuk-table__header">
                {report.fileName}
              </th>
              <td className="govuk-table__cell">
                <ButtonLink
                  additionalCssClasses="lbh-!-margin-top-0 lbh-!-no-wrap"
                  secondary={true}
                  href={`/api/reports/novalet/download/${report.fileName}`}
                >
                  Download CSV
                </ButtonLink>
              </td>
              <td className="govuk-table__cell">
                <Button
                  className="lbh-!-margin-top-0 lbh-!-no-wrap"
                  onClick={() => approveNovaletExport(report)}
                >
                  Sync to Novalet
                </Button>
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
