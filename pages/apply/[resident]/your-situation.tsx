import { useRouter } from 'next/router';
import { useStore } from 'react-redux';
import { useState } from 'react';

import { Store } from '../../../lib/store';
import { getResident } from '../../../lib/utils/resident';

import { updateResidentsFormData } from '../../../lib/utils/resident';
import { FormData } from '../../../lib/types/form';

import { HeadingTwo } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Layout from '../../../components/layout/resident-layout';
import Form from '../../../components/form/form';
import Hint from '../../../components/form/hint';

import CourtOrder from '../../../data/forms/Situation/court-order.json';
import AccommodationType from '../../../data/forms/Situation/accommodation-type.json';
import DomesticViolence from '../../../data/forms/Situation/domestic-violence.json';
import Homelessness from '../../../data/forms/Situation/homelessness.json';
import Subletting from '../../../data/forms/Situation/subletting.json';
import MedicalNeed from '../../../data/forms/Situation/medical-need.json';
import PurchasingProperty from '../../../data/forms/Situation/purchasing-property.json';
import PropertyOwnership from '../../../data/forms/Situation/property-ownership.json';
import SoldProperty from '../../../data/forms/Situation/sold-property.json';
import RelationshipBreakdown from '../../../data/forms/Situation/relationship-breakdown.json';
import Arrears from '../../../data/forms/Situation/arrears.json';
import UnderOccupying from '../../../data/forms/Situation/under-occupying.json';
import Benefits from '../../../data/forms/Situation/benefits.json';
import Landlord from '../../../data/forms/Situation/landlord.json';
import OtherHousingRegister from '../../../data/forms/Situation/other-housing-register.json';
import BreachOfTenancy from '../../../data/forms/Situation/breach-of-tenancy.json';
import legalRestrictions from '../../../data/forms/Situation/legal-restrictions.json';
import unspentConvictions from '../../../data/forms/Situation/unspent-convictions.json';

export default function YourSituation() {
  const questionData = (formId: string) => {
    switch (formId) {
      case 'court-order':
        return CourtOrder;

      case 'accommodation-type':
        return AccommodationType;

      case 'domestic-violence':
        return DomesticViolence;

      case 'homelessness':
        return Homelessness;

      case 'subletting':
        return Subletting;

      case 'medical-need':
        return MedicalNeed;

      case 'purchasing-property':
        return PurchasingProperty;

      case 'property-ownership':
        return PropertyOwnership;

      case 'sold-property':
        return SoldProperty;

      case 'relationship-breakdown':
        return RelationshipBreakdown;

      case 'arrears':
        return Arrears;

      case 'under-occupying':
        return UnderOccupying;

      case 'benefits':
        return Benefits;

      case 'landlord':
        return Landlord;

      case 'other-housing-register':
        return OtherHousingRegister;

      case 'breach-of-tenancy':
        return BreachOfTenancy;

      case 'legal-restrictions':
        return legalRestrictions;

      case 'unspent-convictions':
        return unspentConvictions;

      default:
        return undefined;
    }
  };

  const router = useRouter();
  const store = useStore<Store>();

  const [formData, setFormData] = useState({});
  const [applicationData, setApplicationData] = useState({});
  const [activeStep, setActiveStep] = useState('');
  const [currentAccomodation, setCurrentAccomodation] = useState('');

  let thisResident = router.query.resident as string;
  const currentResident = getResident(thisResident, store.getState());

  let name = '';
  if (currentResident && currentResident.name) {
    name = currentResident.name;
  }

  const baseHref = `/apply/${currentResident?.slug}`;
  const returnHref = '/apply/overview';

  const formName = 'your-situation';

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

  const updateFormData = (formId: string) => {
    const formData = questionData(formId);
    setApplicationData(formData!);
    setFormData(formData!);
    setActiveStep(formData?.steps[0].fields[0].name!);
    console.log('active step', formData?.steps[0].fields[0].name!);
  };

  const startingData = () => {
    updateFormData('homelessness');
  };

  const startingDataFromAccomodationStatus = () => {
    switch (currentAccomodation) {
      case 'squatter':
        updateFormData('court-order');
        break;
      case 'unauthorised-occupant':
        updateFormData('accommodation-type');
        break;
      case 'owner-occupier':
        updateFormData('domestic-violence');
        break;
      default:
        updateFormData('court-order');
        break;
    }
  };

  if (Object.keys(applicationData).length === 0) {
    //if (currentAccomodation.length === 0) {
    startingData();
    // } else {
    //   startingDataFromAccomodationStatus();
    // }
  }

  const nextStep = async (values: FormData) => {
    const data: { [key: string]: FormData } = { ...applicationData };

    console.log('------next step----');

    // console.log('data', data);
    // console.log('values', values);

    // console.log('extracted value', values[data.id]);

    var formId = data.conditionals.find(
      (element) => element.value === values[data.id]
    );

    console.log('found form id', formId);

    console.log('next form id', formId.nextFormId);

    updateFormData(formId.nextFormId);

    console.log('------end next step----');
  };

  const onSave = (values: FormData) => {
    const data: { [key: string]: FormData } = { ...applicationData };
    data[formName!] = values;

    // console.log('Active Step', activeStep);
    const extractedData: string = values[activeStep];

    // console.log('extracted data', values);
    // console.log('data', data.conditionals);

    updateResidentsFormData(store, currentResident!, data);
  };

  const onExit = async () => {
    // console.log('On Exit');
  };

  return (
    <>
      <Layout breadcrumbs={breadcrumbs}>
        <Hint content={name} />
        {formData.heading && <HeadingTwo content={formData.heading} />}
        {formData.copy && <Paragraph>{formData.copy}</Paragraph>}
        <Form
          buttonText="Save and continue"
          formData={formData}
          onExit={onExit}
          onSave={onSave}
          onSubmit={nextStep}
          activeStep={activeStep}
          //residentsPreviousAnswers={residentsPreviousAnswers}
        />
      </Layout>
    </>
  );
}
