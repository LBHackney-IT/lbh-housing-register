import Link from "next/link"

interface TableProps {
  caption?: string
}

export default function ApplicationTable({ caption }: TableProps): JSX.Element {
  return (
    <table className="govuk-table lbh-table">
      {caption && (
        <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
          {caption}
        </caption>
      )}
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Reference
          </th>
          <th scope="col" className="govuk-table__header">
            Applicant
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            Submitted
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">#LBH-12345</th>
          <td className="govuk-table__cell">
            <Link href="/applications/LBH-12345">
              <a className="govuk-link govuk-custom-text-color">Test applicant</a>
            </Link>
          </td>
          <td className="govuk-table__cell">Pending</td>
          <td className="govuk-table__cell">1 day ago</td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">#LBH-12345</th>
          <td className="govuk-table__cell">
            <Link href="/applications/LBH-12345">
              <a className="govuk-link govuk-custom-text-color">Test applicant</a>
            </Link>
          </td>
          <td className="govuk-table__cell">Pending</td>
          <td className="govuk-table__cell">1 day ago</td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">#LBH-12345</th>
          <td className="govuk-table__cell">
            <Link href="/applications/LBH-12345">
              <a className="govuk-link govuk-custom-text-color">Test applicant</a>
            </Link>
          </td>
          <td className="govuk-table__cell">Pending</td>
          <td className="govuk-table__cell">1 day ago</td>
        </tr>
      </tbody>
    </table>
  )
}
