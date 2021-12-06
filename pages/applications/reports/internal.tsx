import { Form, Formik } from 'formik';
import router from 'next/router';
import React, { useRef } from 'react';
import Button, { ButtonLink } from '../../../components/button';
import DateInput from '../../../components/form/dateinput';
import Radios from '../../../components/form/radios';
import { downloadInternalExport } from '../../../lib/gateways/internal-api';

interface FormValues {
  reportType: number;
  startDate: string;
  endDate: string;
}

export default function InternalReports(): JSX.Element {
  const downloadRef = useRef<HTMLAnchorElement>(null);
  
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

  async function handleSubmit(form: FormValues) {
    // const query = new URLSearchParams();
    // query.set('reportType', form.reportType.toString());
    // query.set(
    //   'startDate',
    //   new Date(form.startDate).toISOString().split('T')[0]
    // );
    // query.set('endDate', new Date(form.endDate).toISOString().split('T')[0]);
    
    var data = {
      reportType : parseInt(form.reportType.toString()),
      startDate :  new Date(form.startDate),
      endDate : new Date(form.endDate)
    }
    
    var response = await downloadInternalExport(data);

    if (response){
      debugger;
      var fileName = response.headers.get('Content-Disposition')?.split('filename=')[1].split(';')[0].replaceAll('"', '')!;
      var blob = await response.blob();
      debugger;
      const href = window.URL.createObjectURL(blob);
    
      const a = downloadRef.current!;
      a.download  = fileName;
      a.href = href;
      a.click();
      a.href = '';
    }
    // router.push({
    //   pathname: '/api/reports/internal/download',
    //   query: query.toString(),
    // });
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

          <div className="govuk-!-display-inline-block">
            <DateInput name={'startDate'} label={'Start date'} />
          </div>

          <div className="govuk-!-display-inline-block">
            <DateInput name={'endDate'} label={'End date'} />
          </div>
          
          <Button type="submit">Download .csv file</Button>
          <a ref={downloadRef}></a>
        </Form>
      )}
    </Formik>
  );
}
