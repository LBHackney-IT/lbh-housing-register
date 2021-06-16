import { HeadingOne } from '../../../components/content/headings';
import Layout from '../../../components/layout/resident-layout';
import { FormData } from '../../../lib/types/form';
import { getHouseHoldData } from '../../../lib/utils/form-data';
import { useRouter } from 'next/router';
import { Store } from '../../../lib/store';
import { useStore } from 'react-redux';
import { updateFormData } from '../../../lib/store/resident';
import { buildValidationSchema } from '../../../lib/utils/validation';
import { Form as FormikForm, Formik } from 'formik';
import Button from '../../../components/button';
import { useState } from 'react';

import {
  getDisplayStateOfField,
  getInitialValuesFromMultiStepForm,
} from '../../../lib/utils/form';

import { HeadingTwo } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import DynamicField from '../../../components/form/dynamic-field';

import { extractAdditionalResidentFromData, extractMainResidentFromData } from '../../../lib/utils/helper'


const PeoplePage = ({

}): JSX.Element => {
  const router = useRouter();
  const store = useStore<Store>();
  const resident = store.getState().resident;
  console.log('what is resident', resident)

  const providedUsername: FormData = {
    email: resident.username,
  };

  const className = undefined;
  let exit = false;
  const onExit = false;
  
  // const countOfPeopleInApplication:any = resident.formData.household;
  const countOfPeopleInApplication:any = 2;

  const formData = getHouseHoldData(countOfPeopleInApplication);
  
  const [formDataSnapshot] = useState(formData);
  const [stepNumber] = useState(0);
  
  const [snapshot] = useState(getInitialValuesFromMultiStepForm(formDataSnapshot));
  
  const step: any = formDataSnapshot.steps[stepNumber];
  console.log('what is step', step)
  

  const handleSubmission = async (values: FormData) => {
    console.log('confirmPeopleInApplication', values)

    if (countOfPeopleInApplication > 1) {
      // const mainResident = extractMainResidentFromData(values);
      // console.log('mainResident', mainResident)
      // store.dispatch(updateFormData(mainResident))
      const additionalResident = extractAdditionalResidentFromData(values, countOfPeopleInApplication - 1);
      // console.log('additionalResident', additionalResident)

    }

    store.dispatch(updateFormData(values));
    const resident = store.getState().resident;
    console.log('yes sir', resident)


    // router.push('/apply/overview');
  };

  return (
    <Layout>
      <HeadingOne content="People in this application" />

      <Formik
        initialValues={snapshot}
        onSubmit={handleSubmission}
        validationSchema={buildValidationSchema(step.fields)}
      >
        {({ isSubmitting, values }) => (
           <FormikForm>
            {step.heading && <HeadingTwo content={step.heading} />}
            {step.copy && <Paragraph>{step.copy}</Paragraph>}
            {step.person && <Paragraph>{step.person}</Paragraph>}

              {step.fields.map((field:any, index:any) => {
                const display: boolean = getDisplayStateOfField(field, values);
                if (display) {
                  return <DynamicField key={index} field={field} />
                }
              })}

            <div className="c-flex__1 text-right">
              <Button
                onClick={() => (exit = false)}
                disabled={isSubmitting}
                type="submit"
              >
                {'Save'}
              </Button>
            </div>


            {onExit && (
              <div className="text-right">
                <Button
                  onClick={() => (exit = true)}
                  disabled={isSubmitting}
                  type="submit"
                  secondary={false}
                >
                  Save and exit
                </Button>
              </div>
            )}
         </FormikForm>
        )}
      </Formik>
    </Layout>
  );
};

export default PeoplePage;


