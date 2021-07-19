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
import { FormData } from '../../../lib/types/form';

import CourtOrder from '../../../data/forms/Situation/question-1.json';
import AccommodationType from '../../../data/forms/Situation/question-2.json';
import DomesticViolence from '../../../data/forms/Situation/question-3.json';
import Homelessness from '../../../data/forms/Situation/question-4.json';
import Subletting from '../../../data/forms/Situation/question-5.json';
import MedicalNeed from '../../../data/forms/Situation/question-6.json';
import PurchasingProperty from '../../../data/forms/Situation/question-7.json';
import PropertyOwnership from '../../../data/forms/Situation/question-8.json';
import SoldProperty from '../../../data/forms/Situation/question-9.json';
import RelationshipBreakdown from '../../../data/forms/Situation/question-10.json';
import Arrears from '../../../data/forms/Situation/question-11.json';
import UnderOccupying from '../../../data/forms/Situation/question-12.json';
import Benefits from '../../../data/forms/Situation/question-13.json';
import Landlord from '../../../data/forms/Situation/question-14.json';
import OtherHousingRegister from '../../../data/forms/Situation/question-15.json';
import BreachOfTenancy from '../../../data/forms/Situation/question-16.json';
import legalRestrictions from '../../../data/forms/Situation/question-17.json';
import unspentConvictions from '../../../data/forms/Situation/question-18.json';
import { constructApplication } from '../../../lib/utils/helper';

export default function YourSituation() {
  const questionData = (formId: string) => {
    switch (formId) {
      case '1':
        return CourtOrder;

      case '2':
        return AccommodationType;

      case '3':
        return DomesticViolence;

      case '4':
        return Homelessness;

      case '5':
        return Subletting;

      case '6':
        return MedicalNeed;

      case '7':
        return PurchasingProperty;

      case '8':
        return PropertyOwnership;

      case '9':
        return SoldProperty;

      case '10':
        return RelationshipBreakdown;

      case '11':
        return Arrears;

      case '12':
        return UnderOccupying;

      case '13':
        return Benefits;

      case '14':
        return Landlord;

      case '15':
        return OtherHousingRegister;

      case '16':
        return BreachOfTenancy;

      case '17':
        return legalRestrictions;

      case '18':
        return unspentConvictions;

      default:
        return undefined;
    }
  };

  const router = useRouter();
  const store = useStore<Store>();

  let thisResident = router.query.resident as string;
  const currentResident = getResident(thisResident, store.getState());

  let name = '';
  if (currentResident && currentResident.name) {
    name = currentResident.name;
  }

  const [applicationData, setApplicationData] = useState({});
  const [initValues, setInitValues] = useState({});
  const [questions, setQuestions] = useState({});
  const [currentAccomodation, setCurrentAccomodation] = useState(
    currentResident?.formData['address-details']?.['current-acommodation']
  );
  const [onExit, setOnExit] = useState(false);

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
    },
  ];

  const activeStep = 'your-situation';

  if (Object.keys(questions).length === 0) {
    console.log('Current Accomodation: ', currentAccomodation);

    if (!currentAccomodation || currentAccomodation.length === 0) {
      //router.push(returnHref);
      setQuestions(questionData('1')!);
    }

    switch (currentAccomodation) {
      case 'squatter':
        setQuestions(questionData('1')!);
        break;
      case 'unauthorised-occupant':
        setQuestions(questionData('2')!);
        break;
      case 'owner-occupier':
        setQuestions(questionData('3')!);
        break;
      default:
        setQuestions(questionData('1')!);
        break;
    }
  }

  const onSave = (values: FormData) => {
    const data: { [key: string]: FormData } = { ...applicationData };

    data[activeStep!] = values;

    //console.log('the data', data);

    const formData = data['your-situation'];
    //console.log('formData', formData);

    const stepName: string = questions.steps[0].fields[0].name;
    //console.log('step Name', stepName);

    const extractedValue: string = formData[stepName];
    //console.log('extractedValue', extractedValue);

    if (exitForm(extractedValue, stepName)) {
      router.push(returnHref);
    }

    const nextQuestion = questionData(extractedValue);

    setQuestions(nextQuestion!);

    if (nextQuestion?.conditionals.no === '-1') {
      setOnExit(true);
      //console.log('no: last question');
    }

    if (nextQuestion?.conditionals.yes === '-1') {
      setOnExit(true);
      //console.log('yes: last question');
    }

    updateResidentsFormData(store, currentResident!, data);
  };

  const exitForm = (values: string, currentStep: string) => {
    if (values === '0') {
      //console.log('Exit form');
      return true;
    }

    if (values === '-1') {
      //console.log('Exit for last question');
      return true;
    }

    //console.log('Do not exit form');
    return false;
  };

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
              <h1>Question Number {questions.id}</h1>
              {questions.heading && <HeadingTwo content={questions.heading} />}
              {questions.copy && <Paragraph>{questions.copy}</Paragraph>}

              {questions.steps.map((person: any, index: any) => {
                return <DynamicField key={index} field={person.fields[0]} />;
              })}

              <div className="c-flex lbh-simple-pagination">
                <div className="c-flex__1 text-right">
                  <Button
                    //onClick={onSave}
                    //disabled={isSubmitting}
                    type="submit"
                  >
                    {'Save and continue'}
                  </Button>
                </div>
              </div>

              {onExit && (
                <div className="text-right">
                  <Button
                    //onClick={() => (exit = true)}
                    //disabled={onExit}
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
  );
}
