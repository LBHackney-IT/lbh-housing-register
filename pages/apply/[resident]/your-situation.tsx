import { Form, Formik } from 'formik';
import Button from '../../../components/button';
import Layout from '../../../components/layout/resident-layout';
import { useRouter } from 'next/router';
import { useStore } from 'react-redux';
import { Store } from '../../../lib/store';
import { getResident } from '../../../lib/utils/resident';
import Hint from '../../../components/form/hint';
import { HeadingTwo } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import DynamicField from '../../../components/form/dynamic-field';
import { updateResidentsFormData } from '../../../lib/utils/resident';
import { useState } from 'react';
import CourtOrder from '../../../data/forms/court-order.json';
import SocialTenant from '../../../data/forms/social-tenant.json';

// TODO: initialValues - 
// TODO: Conditional logic
// TODO: exit logic
// TODO: form data is not being saved
// TODO: order of questions need to be worked out
// TODO: validation

export default function YourSituation() {

  const router = useRouter();
  const store = useStore<Store>();

  let thisResident = router.query.resident;
  thisResident = thisResident as string;
  const currentResident = getResident(thisResident, store.getState());

  const [applicationData, setApplicationData] = useState({});
  const [initValues, setInitValues] = useState({});
  const [questions, setQuestions] = useState({});

  if(Object.keys(questions).length === 0) {
    //TODO: Need to take into consideration if squatter, unauthorised, owner, none of the above
    setQuestions(CourtOrder)
  }

  const onExit = true;

  const baseHref = `/apply/${currentResident?.slug}`;
  const returnHref = '/apply/overview';
  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: `${currentResident?.name}`,
    },
    {
      href: `${baseHref}/your-situation`,
      name: `Your Situation`,
    }
  ];

  const activeStep = 'your-situation';

  const onSave = (values: FormData) => {

    const data: { [key: string]: FormData } = { ...applicationData };
    data[activeStep!] = values;

    setApplicationData(data);
    updateResidentsFormData(store, currentResident, data);

    if (exitForm(values)) {
      router.push(baseHref)
    }

    setQuestions(SocialTenant)
  };

  const exitForm = (values) => {
    // check if particular answer is No and then redirect to the exit screen using router.push()
    return false;
  }

  return (
    <>
    <Layout breadcrumbs={breadcrumbs}>
      <Hint content={currentResident.name} />

      <Formik 
          initialValues={initValues}
          onSubmit={onSave}
          validationSchema=""
        >
          {({ isSubmitting }) => (
            <Form>
              {questions.heading && <HeadingTwo content={questions.heading} />}
              {questions.copy && <Paragraph>{questions.copy}</Paragraph>}

              {questions.steps.map((person:any, index:any) => {
                return <DynamicField key={index} field={person.fields[0]}  />
              })}


            <div className="c-flex lbh-simple-pagination">     
              <div className="c-flex__1 text-right">
                <Button
                  onClick={onSave}
                  // disabled={isSubmitting}
                  type="submit"
                >
                  {'Save and continue'}
                </Button>
              </div>
            </div>

            {onExit && (
              <div className="text-right">
                <Button
                  onClick={() => (exit = true)}
                  disabled={isSubmitting}
                  type="submit"
                  secondary={true}
                >
                  Save and exit
                </Button>
              </div>
            )}
            </Form>
          )}
        </Formik>
    </Layout>
    </>
  )
}