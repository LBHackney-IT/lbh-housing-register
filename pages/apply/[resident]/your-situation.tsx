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

import Question1 from '../../../data/forms/Situation/question-1.json';
import Question2 from '../../../data/forms/Situation/question-2.json';
import Question3 from '../../../data/forms/Situation/question-3.json';
import Question4 from '../../../data/forms/Situation/question-4.json';
import Question5 from '../../../data/forms/Situation/question-5.json';
import Question6 from '../../../data/forms/Situation/question-6.json';
import Question7 from '../../../data/forms/Situation/question-7.json';
import Question8 from '../../../data/forms/Situation/question-8.json';
import Question9 from '../../../data/forms/Situation/question-9.json';
import Question10 from '../../../data/forms/Situation/question-10.json';
import Question11 from '../../../data/forms/Situation/question-11.json';
import Question12 from '../../../data/forms/Situation/question-12.json';
import Question13 from '../../../data/forms/Situation/question-13.json';
import Question14 from '../../../data/forms/Situation/question-14.json';
import Question15 from '../../../data/forms/Situation/question-15.json';
import Question16 from '../../../data/forms/Situation/question-16.json';
import Question17 from '../../../data/forms/Situation/question-17.json';
import Question18 from '../../../data/forms/Situation/question-18.json';

// TODO: initialValues - pre-population
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
  console.log('currentResident', currentResident);

  let name = ''
  if (currentResident && currentResident.name) {
    name = currentResident.name;
  }

  const [applicationData, setApplicationData] = useState({});
  const [initValues, setInitValues] = useState({});
  const [questions, setQuestions] = useState({});

  if (Object.keys(questions).length === 0) {
    var currentAccomodation =
      currentResident?.formData['address-details']?.['current-acommodation'];

    if (!currentAccomodation || currentAccomodation.length === 0) {
      router.push('/apply/you');
    }

    switch (currentAccomodation.toLowerCase()) {
      case 'squatter':
        setQuestions(Question1);
        break;
      case 'unauthorised-occupant':
        setQuestions(Question2);
        break;
      case 'owner-occupier':
        setQuestions(Question3);
        break;
      default:
        setQuestions(Question4);
        break;
    }
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
      <Hint content={name} />

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