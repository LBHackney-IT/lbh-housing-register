import { Form, Formik } from 'formik';
import router from 'next/router';
import React, { useState } from 'react';
import Button from '../../../components/button';
import DateInput from '../../../components/form/dateinput';
import Radios from '../../../components/form/radios';

export default function InternalReports(): JSX.Element {
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

  function handleSubmit(form: any) {
    const query = new URLSearchParams(form);
    router.push({
      pathname: '/api/reports/internal/download',
      query: query.toString(),
    });
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

          <Button type="submit">Download .csv file</Button>
        </Form>
      )}
    </Formik>
  );
}
