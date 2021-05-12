interface TableProps {
  children: JSX.Element | JSX.Element[]
}

export default function Table({ children }: TableProps): JSX.Element {
  children = Array.isArray(children) ? children : [children]

  const headings: JSX.Element[] = []
  const rows: JSX.Element[] = []

  children.map(child => {
    switch (child.type) {
      case TableHeading:
        headings.push(child)
        break;

      default:
        rows.push(child)
        break;
    }
  })

  return (
    <table className="govuk-table lbh-table">
      {headings.length > 0 && (
        <thead className="govuk-table__head">
          <TableRow>
            {headings.map(heading => heading)}
          </TableRow>
        </thead>
      )}

      <tbody className="govuk-table__body">
        {rows.map(row => row)}
      </tbody>
    </table>
  )
}

interface TableCellProps {
  children: number | string
}

export function TableCell({ children }: TableCellProps): JSX.Element {
  let className = "govuk-table__cell"

  if (typeof(children) == "number") {
    className += ` ${className}--numeric`
  }

  return (
    <td className={className}>
      {children}
    </td>
  )
}

interface TableHeadingProps {
  children: string
}

export function TableHeading({ children }: TableHeadingProps): JSX.Element {
  return (
    <th scope="col" className="govuk-table__header">
      {children}
    </th>
  )
}

export function TableRow({ children }: TableProps): JSX.Element {
  return (
    <tr className="govuk-table__row">
      {children}
    </tr>
  )
}