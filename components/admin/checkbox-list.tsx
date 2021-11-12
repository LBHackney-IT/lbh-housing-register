export interface CheckBoxListDataProps {
  title: string;
  value: string;
  isChecked: boolean;
}

export interface CheckBoxListPageProps {
  title: string;
  data: CheckBoxListDataProps[];
}

export default function CheckBoxList({
  title,
  data,
}: CheckBoxListPageProps): JSX.Element {
  return (
    <table className="govuk-table lbh-table">
      <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
        {title}
      </caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: '45%' }}
          ></th>
          <th scope="col" className="govuk-table__header"></th>
          {/* <th scope="col" className="govuk-table__header">
            checked
          </th> */}
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {data.map((info, index) => (
          <tr key={index} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              {info.title}
            </th>
            <td className="govuk-table__cell">{info.value}</td>
            {/* <td className="govuk-table__cell">
              <input type="checkbox" />{' '}
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
