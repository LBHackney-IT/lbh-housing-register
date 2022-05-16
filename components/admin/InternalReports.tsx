import { withFormik } from 'formik';
import React, { useRef } from 'react';
import Button from '../button';
import DateInput from '../form/dateinput';
import Radios from '../form/radios';

export default function InternalReports(): JSX.Element {
  const internalReportForm = useRef<HTMLFormElement | null>(null);

  const doHtmlFormPost = () => {
    if (internalReportForm.current) {
      internalReportForm.current.submit();
    }
  };

  const runDate = new Date();

  const initialValues = {
    reportType: '0',
    startDate: new Date(
      runDate.getFullYear(),
      runDate.getMonth(),
      1
    ).toDateString(),
    endDate: new Date(
      runDate.getFullYear(),
      runDate.getMonth() + 1,
      0
    ).toDateString(),
  };

  const InternalReportForm = withFormik({
    handleSubmit: doHtmlFormPost,
    mapPropsToValues: () => initialValues,
  })(({ handleSubmit }) => {
    return (
      <form
        action="/api/reports/internal/download"
        method="POST"
        ref={internalReportForm}
        onSubmit={handleSubmit}
      >
        <Radios
          label="Report"
          name="ReportType"
          options={[
            { label: 'Case log', value: '0' },
            { label: 'Resident log', value: '1' },
            { label: 'Case activity log', value: '2' },
            { label: 'Officer activity log', value: '3' },
          ]}
        />

        <DateInput name={'StartDate'} label={'Start date'} />

        <DateInput name={'EndDate'} label={'End date'} />

        <Button type="submit">Download CSV file</Button>
      </form>
    );
  });

  return <InternalReportForm />;
}
