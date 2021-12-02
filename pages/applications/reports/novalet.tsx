import Link from 'next/link';
import { generateNovaletExport } from '../../../lib/gateways/internal-api';

export default function NovaletReports(reports: string[]): JSX.Element {
  return reports.length > 0 ? (
    <>
      {reports.map((report: string) => (
        <div key={report}>
          <Link href={`/api/reports/novalet/download/${report}`}>
            <a className="govuk-breadcrumbs__link">{report}</a>
          </Link>
        </div>
      ))}

      <button onClick={generateNovaletExport}>Generate file</button>
    </>
  ) : (
    <div></div>
  );
}
