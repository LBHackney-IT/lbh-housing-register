import React, { useState } from 'react';
import router from 'next/router';
import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import Button from '../../components/button';
import Paragraph from '../../components/content/paragraph';
import AddCaseSection from '../../components/admin/AddCaseSection';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  getSectionData,
  generateInitialValues,
  generateQuestionArray,
} from '../../lib/utils/adminHelpers';
import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../../components/summary-list';
import { INVALID_DATE } from '../../components/form/dateinput';
import FormGroup from '../../components/form/form-group';
import Dialog from '../../components/dialog';
import { scrollToTop } from '../../lib/utils/scroll';
import * as Yup from 'yup';
import ErrorSummary from '../../components/errors/error-summary';
import { getFormData, FormID } from '../../lib/utils/form-data';
import { HeadingThree } from '../../components/content/headings';

const keysToIgnore = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

// console.log(FormID);

const sections = allFormSections(keysToIgnore);
const initialValues = generateInitialValues(sections);

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  addressTownCity: string;
  addressCounty: string;
  addressPostcode: string;
}

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  addressTownCity: '',
  addressCounty: '',
  addressPostcode: '',
};

export default function AddCasePage({ user }: PageProps): JSX.Element {
  // const [isMainApplicant, setIsMainApplicant] = useState(true);
  const [isSumbitted, setIsSumbitted] = useState(false);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressToAdd, setAddressToAdd] = useState(emptyAddress as Address);
  const [addresses, setAddresses] = useState([] as Address[]);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values);
    const request: Application = {
      mainApplicant: {
        person: {
          id: '',
          title: values.personalDetails_title,
          firstName: values.personalDetails_firstName,
          surname: values.personalDetails_surname,
          dateOfBirth: values.personalDetails_dateOfBirth,
          gender: values.personalDetails_gender,
          genderDescription: '',
          nationalInsuranceNumber:
            values.personalDetails_nationalInsuranceNumber,
          relationshipType: '',
        },
        address: {
          addressLine1: '1 Hillman Street',
          addressLine2: 'Hackney',
          addressLine3: 'London',
          // postCode: values.addressHistory_addressFinder,
          addressType: 'string',
        },
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
          preferredMethodOfContact: '',
        },
        questions: questionValues,
      },
      otherMembers: [],
    };
    createApplication(request);

    router.reload();
  };

  const handleClick = () => {
    setIsSumbitted(true);
    scrollToTop();
  };

  const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
  const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
  const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
  const residentialStatusSection = getSectionData(FormID.RESIDENTIAL_STATUS);
  const currentAccommodationSection = getSectionData(
    FormID.CURRENT_ACCOMMODATION
  );

  const currentDateTimestamp = Math.min(+new Date());
  const schema = Yup.object({
    personalDetails_title: Yup.string().label('Title').required(),
    personalDetails_firstName: Yup.string().label('First name').required(),
    personalDetails_surname: Yup.string().label('Surname').required(),
    personalDetails_dateOfBirth: Yup.string()
      .notOneOf([INVALID_DATE], 'Invalid date')
      .label('Date of birth')
      .required()
      .test('futureDate', 'Date of birth must be in the past', (value) => {
        if (typeof value !== 'string' || value === INVALID_DATE) {
          return false;
        }

        const dateOfBirth = +new Date(value);

        if (currentDateTimestamp < dateOfBirth) {
          return false;
        }

        return true;
      }),
    personalDetails_gender: Yup.string().label('Gender').required(),
    personalDetails_nationalInsuranceNumber: Yup.string()
      .label('NI number')
      .required(),
    immigrationStatus_citizenship: Yup.string().label('Citizenship').required(),
    currentAccommodation_livingSituation: Yup.string()
      .label('Living situation')
      .required(),
  });

  const addEditAddress = (event: any) => {
    event.preventDefault();
    console.log(addressToAdd);

    setAddresses([...addresses, addressToAdd]);
    setAddressDialogOpen(false);
    setAddressToAdd(emptyAddress);
  };

  const handleAddressChange = (event: any) => {
    const { name, value } = event.target;
    setAddressToAdd({ ...addressToAdd, [name]: value });
  };

  const editAddress = (addressIndex: number) => {
    console.log('editAddress', addressIndex);
    setAddressToAdd(addresses[addressIndex]);
    setAddressDialogOpen(true);
  };

  const deleteAddress = (addressIndex: number) => {
    console.log('deleteAddress', addressIndex);
    const newAddresses = [...addresses];
    newAddresses.splice(addressIndex, 1);
    setAddresses(newAddresses);
  };

  // console.log(sections);

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting, errors, isValid }) => {
            return (
              <>
                {!isValid && isSumbitted ? (
                  <ErrorSummary title="There is a problem">
                    <ul className="govuk-list govuk-error-summary__list">
                      {Object.entries(errors).map(([inputName, errorTitle]) => (
                        <li key={inputName}>
                          <a href={`#${inputName}`}>{errorTitle}</a>
                        </li>
                      ))}
                    </ul>
                  </ErrorSummary>
                ) : null}
                <Form>
                  <AddCaseSection
                    sectionHeading={personalDetailsSection.sectionHeading}
                    sectionId={personalDetailsSection.sectionId}
                    sectionData={personalDetailsSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={immigrationStatusSection.sectionHeading}
                    sectionId={immigrationStatusSection.sectionId}
                    sectionData={immigrationStatusSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={medicalNeedsSection.sectionHeading}
                    sectionId={medicalNeedsSection.sectionId}
                    sectionData={medicalNeedsSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={residentialStatusSection.sectionHeading}
                    sectionId={residentialStatusSection.sectionId}
                    sectionData={residentialStatusSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={currentAccommodationSection.sectionHeading}
                    sectionId={currentAccommodationSection.sectionId}
                    sectionData={currentAccommodationSection.fields}
                  />

                  {/* Address history */}
                  {/* addressHistory_addressFinder */}

                  <SummaryListNoBorder>
                    <SummaryListRow>
                      <SummaryListKey>Address history</SummaryListKey>
                      <SummaryListValue>
                        <label htmlFor="addressHistory_addressFinder">
                          Address history
                        </label>
                      </SummaryListValue>
                      <SummaryListActions wideActions={true}>
                        {addresses.map((address, index) => (
                          <FormGroup>
                            {index === 0 ? (
                              <HeadingThree content="Current address" />
                            ) : null}
                            {index === 1 ? (
                              <HeadingThree content="Previous addresses" />
                            ) : null}
                            <Paragraph>
                              {address.addressLine1}
                              <br />
                              {address.addressLine2 ? (
                                <>
                                  address.addressLine2
                                  <br />
                                </>
                              ) : null}

                              {address.addressTownCity}
                              <br />
                              {address.addressCounty}
                              <br />
                              {address.addressPostcode}
                            </Paragraph>
                            <a
                              className="lbh-link"
                              href="#edit"
                              onClick={() => editAddress(index)}
                            >
                              Edit
                            </a>{' '}
                            <a
                              className="lbh-link"
                              href="#delete"
                              onClick={() => deleteAddress(index)}
                            >
                              Delete
                            </a>
                          </FormGroup>
                        ))}
                        <Button onClick={() => setAddressDialogOpen(true)}>
                          Add address
                        </Button>
                      </SummaryListActions>
                    </SummaryListRow>
                  </SummaryListNoBorder>

                  <Dialog
                    isOpen={addressDialogOpen}
                    title="Add address"
                    onCancel={() => setAddressDialogOpen(false)}
                    onCancelText="Close"
                  >
                    <>
                      <FormGroup>
                        <label
                          className="govuk-label lbh-label"
                          htmlFor="addressLine1"
                        >
                          Building and street
                        </label>
                        <input
                          className="govuk-input lbh-input govuk-!-width-two-thirds"
                          name="addressLine1"
                          value={addressToAdd.addressLine1}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label
                          className="govuk-label lbh-label"
                          htmlFor="addressLine2"
                        >
                          Building and street line 2
                        </label>
                        <input
                          className="govuk-input lbh-input govuk-!-width-two-thirds"
                          name="addressLine2"
                          value={addressToAdd.addressLine2}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label
                          className="govuk-label lbh-label"
                          htmlFor="addressTownCity"
                        >
                          Town or city
                        </label>
                        <input
                          className="govuk-input lbh-input govuk-!-width-two-thirds"
                          name="addressTownCity"
                          value={addressToAdd.addressTownCity}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label
                          className="govuk-label lbh-label"
                          htmlFor="addressCounty"
                        >
                          County
                        </label>
                        <input
                          className="govuk-input lbh-input govuk-!-width-two-thirds"
                          name="addressCounty"
                          value={addressToAdd.addressCounty}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label
                          className="govuk-label lbh-label"
                          htmlFor="addressPostcode"
                        >
                          Postcode
                        </label>
                        <input
                          className="govuk-input lbh-input govuk-input--width-10"
                          name="addressPostcode"
                          value={addressToAdd.addressPostcode}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <Button onClick={addEditAddress}>Add address</Button>
                    </>
                  </Dialog>

                  {/* {sections.map((section, index) => (
                    <AddCaseSection
                      key={index}
                      sectionHeading={section.sectionHeading}
                      sectionId={section.sectionId}
                      sectionData={section.fields}
                    />
                  ))} */}

                  <div className="c-flex__1 text-right">
                    <Button
                      onClick={handleClick}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Save new Application
                    </Button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </Layout>
    </UserContext.Provider>
  );
}
