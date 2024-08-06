import React, { useRef, useState } from 'react';

import { Form, Formik } from 'formik';

import Button from '../button';
import DateInput from '../form/dateinput';
import Radios from '../form/radios';

interface FormValues {
  reportType: string;
  startDate: string;
  endDate: string;
}

const runDate = new Date();
const initialValues: FormValues = {
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

export default function InternalReports(): JSX.Element {
  const [valuesToSubmit, setValuesToSubmit] = useState(initialValues);

  const internalReportForm = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (values: FormValues) => {
    setValuesToSubmit(values);
    if (internalReportForm.current) {
      internalReportForm.current.submit();
    }
  };

  const HiddenFormToSubmit = ({ submittedFormData }: any) => {
    const { reportType, startDate, endDate } = submittedFormData;
    const payloadStartDate = new Date(startDate).toISOString().split('T')[0];
    const payloadEndDate = new Date(endDate).toISOString().split('T')[0];

    return (
      <form
        action="/api/reports/internal/download"
        method="POST"
        ref={internalReportForm}
      >
        <input type="hidden" name="ReportType" value={reportType} />
        <input type="hidden" name="StartDate" value={payloadStartDate} />
        <input type="hidden" name="EndDate" value={payloadEndDate} />
      </form>
    );
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <>
          <Form>
            <Radios
              label="Report"
              name="reportType"
              options={[
                { label: 'Case log', value: '0' },
                { label: 'Resident log', value: '1' },
                { label: 'Case activity log', value: '2' },
                { label: 'Officer activity log', value: '3' },
              ]}
            />

            <DateInput name="startDate" label="Start date" />

            <DateInput name="endDate" label="End date" />

            <Button type="submit">Download .csv file</Button>
          </Form>
          <HiddenFormToSubmit submittedFormData={valuesToSubmit} />
        </>
      )}
    </Formik>
  );
}
