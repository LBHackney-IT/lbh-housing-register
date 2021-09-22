import { Applicant } from '../../domain/HousingApi';

export interface MedicalDetailPageProps {
  assessmentRequested: string;
  linkToMedicalForm: string;
  dateFormRecieved?: Date;
  assessmentDate?: Date;
  outcome: string;
  accessibleHousingRegister: string;
  disability: string;
  additionalInformation: string;
}

export default function MedicalDetail({
  assessmentRequested,
  linkToMedicalForm,
  dateFormRecieved,
  assessmentDate,
  outcome,
  accessibleHousingRegister,
  disability,
  additionalInformation,
}: MedicalDetailPageProps) {
  return (
    <>
      <table className="govuk-table lbh-table">
        <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
          Medical Need
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header"></th>
            <th scope="col" className="govuk-table__header"></th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Assessment requested
            </th>
            <td className="govuk-table__cell">{assessmentRequested}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Link to medical form
            </th>
            <td className="govuk-table__cell">{linkToMedicalForm}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Date form recieved
            </th>
            <td className="govuk-table__cell">{dateFormRecieved}</td>
          </tr>
        </tbody>
      </table>

      <table className="govuk-table lbh-table">
        <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
          Medical Outcome
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header"></th>
            <th scope="col" className="govuk-table__header"></th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Assessment date
            </th>
            <td className="govuk-table__cell">{assessmentDate}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Outcome
            </th>
            <td className="govuk-table__cell">{outcome}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Accessible housing register
            </th>
            <td className="govuk-table__cell">{accessibleHousingRegister}</td>
          </tr>

          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Disability
            </th>
            <td className="govuk-table__cell">{disability}</td>
          </tr>

          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Additional information
            </th>
            <td className="govuk-table__cell">{additionalInformation}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
