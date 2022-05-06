import { Form, Formik } from 'formik';
import router from 'next/router';
import React from 'react';
import { downloadInternalReport } from '../../lib/gateways/internal-api';
import Button from '../button';
import DateInput from '../form/dateinput';
import Radios from '../form/radios';

interface FormValues {
  reportType: number;
  startDate: string;
  endDate: string;
}

export default function InternalReports(): JSX.Element {
  const runDate = new Date();

  const initialValues: FormValues = {
    reportType: 0,
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

  function handleSubmit(form: FormValues) {
    console.log(form);

    const payload = {
      ReportType: form.reportType.toString(),
      StartDate: new Date(form.startDate).toISOString().split('T')[0],
      EndDate: new Date(form.endDate).toISOString().split('T')[0],
    };
    console.log(payload);

    downloadInternalReport(payload);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
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

          <DateInput name={'startDate'} label={'Start date'} />

          <DateInput name={'endDate'} label={'End date'} />

          <Button type="submit">Download CSV file</Button>
        </Form>
      )}
    </Formik>
  );
}
