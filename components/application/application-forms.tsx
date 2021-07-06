import { HeadingOne, HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';
import { Store } from '../../lib/store';
import { FormData } from '../../lib/types/form';
import { getFormIdsFromApplicationSteps } from '../../lib/utils/application-forms';
import { getFormData } from '../../lib/utils/form-data';
import { updateResidentsFormData } from '../../lib/utils/resident';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useStore } from 'react-redux';
import Details from '../../components/form/details';
import { lookUpAddress } from '../../lib/gateways/internal-api';
import AddressSelector from '../../components/form/selectaddress';
import ShowAddress from '../../components/form/showaddress';
import dataInput from '../../data/forms/date-input.json';
import { Applicant } from '../../domain/HousingApi';

interface ApplicationFormsProps {
  activeStep?: string;
  baseHref: string;
  onCompletion: (values: FormData) => void;
  onExit?: () => void;
  resident: Applicant;
  steps: ApplicationSteps[];
}

/**
 * Application form component is made up of multiple forms
 * The idea being that we can offer an overview of the application from this component,
 * as well as a clear journey from the first form to the next, and so on...
 * @param {ApplicationFormsProps} param0 - Property object of the application
 * @returns {JSX.Element}
 */
export default function ApplicationForms({
  activeStep,
  baseHref,
  onCompletion,
  onExit,
  resident: applicant,
  steps,
}: ApplicationFormsProps): JSX.Element {
  const router = useRouter();
  const store = useStore<Store>();
  const [applicationData, setApplicationData] = useState({});

  const [spinner, setSpinner] = useState(false);
  const [addresses, setAddresses] = useState();
  const [currentAddress, setCurrentAddress] = useState();
  const [showInputField, setShowInputField] = useState(false);
  const [timeAtAddressMonths, setTimeAtAddressMonths] = useState({});
  const [timeAtAddressYears, setTimeAtAddressYears] = useState({});

  const formSteps = getFormIdsFromApplicationSteps(steps);

  // TODO this only looks in the questions but of course lot's of data won't be in there.
  const initialValues = Object.fromEntries(
    applicant?.questions?.map((q) => [q.id, q.answer]) || []
  );

  const next = () => {
    let index = formSteps.indexOf(activeStep!) + 1;
    if (index < formSteps.length) {
      activeStep = formSteps[index];
      router.replace(`${baseHref}/${activeStep}`);
    }
  };

  const onSave = (values: FormData) => {
    const data: { [key: string]: FormData } = { ...applicationData };
    data[activeStep!] = values;

    updateResidentsFormData(store, applicant, data);

    const index = formSteps.indexOf(activeStep!) + 1;
    if (index == formSteps.length) {
      onCompletion(data);
    }
  };

  const onAddressLookup = async (postcode: string) => {
    try {
      setSpinner(true);
      lookUpAddress(postcode).then((data) => {
        setSpinner(false);
        setAddresses(data.address);
        setShowInputField(true);
      });
    } catch (err) {
      // TODO: error handling
    }
  };

  const addressSelectorHandler = (e: any) => {
    setCurrentAddress(e.target.value);
    setAddresses(undefined);
  };

  const timeAtAddress = (value: string, name: string) => {
    name === 'years'
      ? setTimeAtAddressYears({ years: value })
      : setTimeAtAddressMonths({ months: value });
  };
  console.log('timeAtAddressMonths', timeAtAddressMonths);
  console.log('timeAtAddressYears', timeAtAddressYears);

  const calculateTotalStay = () => {
    // If time is equal to 5 years or more then enable submit button
  };

  return (
    <>
      {formSteps.map((step, index) => {
        if (step == activeStep) {
          const formData = getFormData(step);
          if (
            showInputField &&
            formData['heading'] === 'Address history' &&
            formData['steps'][0]['fields'].length === 1
          ) {
            formData['steps'][0]['fields'].push(dataInput);
          }

          return (
            <div key={index}>
              {formData.heading && <HeadingOne content={formData.heading} />}
              {formData.copy && (
                <Paragraph>
                  <strong>{formData.copy}</strong>
                </Paragraph>
              )}
              {activeStep === 'address-history' && <Details />}
              {currentAddress && activeStep === 'address-history' && (
                <ShowAddress
                  currentAddress={currentAddress}
                  duration={[timeAtAddressYears, timeAtAddressMonths]}
                />
              )}
              {addresses && (
                <AddressSelector
                  addresses={addresses}
                  addressSelectorHandler={addressSelectorHandler}
                />
              )}

              <Form
                initialValues={initialValues}
                buttonText="Save and continue"
                formData={formData}
                onExit={onExit}
                onSave={onSave}
                onSubmit={next}
                onAddressLookup={onAddressLookup}
                timeAtAddress={timeAtAddress}
              />
            </div>
          );
        }
      })}
    </>
  );
}
