import { HeadingOne, HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';
import { Store } from '../../lib/store';
import { ApplicationSteps } from '../../lib/types/application';
import { FormData } from '../../lib/types/form';
import { Resident } from '../../lib/types/resident';
import { getFormIdsFromApplicationSteps } from '../../lib/utils/application-forms';
import { getFormData } from '../../lib/utils/form-data';
import {
  hasResidentAnsweredForm,
  updateResidentsFormData,
} from '../../lib/utils/resident';
import SummaryList, {
  SummaryListActions,
  SummaryListRow,
  SummaryListValue,
} from '../summary-list';
import Tag from '../tag';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useStore } from 'react-redux';
import Details from '../../components/form/details';
import { lookUpAddress } from '../../lib/gateways/internal-api';
import AddressSelector from '../../components/form/selectaddress';


interface ApplicationFormsProps {
  activeStep?: string;
  baseHref: string;
  onCompletion: (values: FormData) => void;
  onExit?: () => void;
  resident: Resident;
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
  resident,
  steps,
}: ApplicationFormsProps): JSX.Element {
  const router = useRouter();
  const store = useStore<Store>();
  const [applicationData, setApplicationData] = useState({});

  const [spinner, setSpinner] = useState(false);

  const [addresses, setAddresses] = useState();

  const [currentAddress, setCurrentAddress] = useState();

  const formSteps = getFormIdsFromApplicationSteps(steps);

  if (formSteps.includes(activeStep!)) {
    const next = () => {
      const index = formSteps.indexOf(activeStep!) + 1;
      if (index < formSteps.length) {
        activeStep = formSteps[index];
        router.replace(`${baseHref}/${activeStep}`);
      }
    };

    const onSave = (values: FormData) => {
      const data: { [key: string]: FormData } = { ...applicationData };
      data[activeStep!] = values;

      setApplicationData(data);
      updateResidentsFormData(store, resident, data);

      const index = formSteps.indexOf(activeStep!) + 1;
      if (index == formSteps.length) {
        onCompletion(data);
      }
    };

    const onAddressLookup = async (postcode: string) => {
      // console.log('what is spinner', spinner)
      try {
        setSpinner(true)
        lookUpAddress(postcode)
          .then(data => {
            setSpinner(false)
            setAddresses(data.address)
          });
      } catch (err) {
        // TODO: error handling
      }
    }

    const addressSelectorHandler = (e:any) => {
      setCurrentAddress(e.target.value);
      setAddresses(undefined)
    }

    const timeAtAdress = (value:any) => {
      console.log('timeAtAddress', value)
    }

    return (
      <>
        {formSteps.map((step, index) => {
          if (step == activeStep) {
            const formData = getFormData(step);
            const residentsPreviousAnswers = resident.formData[step];

            return (
              <div key={index}>
                {formData.heading && <HeadingOne content={formData.heading} />}
                {activeStep === 'address-history' && <Details />}
                {formData.copy && <Paragraph>{formData.copy}</Paragraph>}
                {currentAddress && activeStep === 'address-history' && <Paragraph><strong>{currentAddress}</strong></Paragraph>}
                {addresses && <AddressSelector addresses={addresses} addressSelectorHandler={addressSelectorHandler} /> }

                <Form
                  buttonText="Save and continue"
                  formData={formData}
                  onExit={onExit}
                  onSave={onSave}
                  onSubmit={next}
                  onAddressLookup={onAddressLookup}
                  timeAtAdress={timeAtAdress}
                  residentsPreviousAnswers={residentsPreviousAnswers}
                />
              </div>
            );
          }
        })}
      </>
    );
  } else {
    return (
      <>
        {steps.map((step, index) => (
          <div key={index}>
            <HeadingTwo content={step.heading} />
            <SummaryList>
              {step.steps.map((formStep, i) => (
                <SummaryListRow key={i}>
                  <SummaryListValue>
                    <Link href={`${baseHref}/${formStep.id}`}>
                      {formStep.heading}
                    </Link>
                  </SummaryListValue>
                  <SummaryListActions>
                    {hasResidentAnsweredForm(resident, formStep.id) ? (
                      <Tag content="Check answers" />
                    ) : (
                      <Tag content="Todo" variant="grey" />
                    )}
                  </SummaryListActions>
                </SummaryListRow>
              ))}
            </SummaryList>
          </div>
        ))}
      </>
    );
  }
}
