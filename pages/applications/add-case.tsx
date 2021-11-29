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
  Address,
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
import { HeadingOne, HeadingThree } from '../../components/content/headings';
import { ApplicationStatus } from '../../lib/types/application-status';
import yourSituation from '../apply/[resident]/your-situation';

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
  const [addressToSave, setAddressToSave] = useState({
    address: emptyAddress as Address,
    isEditing: false,
  });
  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([] as Address[]);

  const onSubmit = (values: FormikValues) => {
    // console.log('Formik values: ', values);

    const questionValues = generateQuestionArray(values, addresses);
    console.log('Question values: ', questionValues);

    // status: ApplicationStatus.MANUAL_DRAFT,
    const request: Application = {
      mainApplicant: {
        person: {
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
        address: addresses[0] || '',
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
          preferredMethodOfContact: '',
        },
        questions: questionValues,
      },
      otherMembers: [],
      sensitiveData: true,
    };

    // console.log(JSON.stringify(request));

    createApplication(request);

    // router.reload();
  };

  const handleSaveApplication = () => {
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

  const armedForcesSection = getSectionData(FormID.SITUATION_ARMED_FORCES);
  const homelessnessSection = getSectionData(FormID.HOMELESSNESS);
  const propertyOwnwershipSection = getSectionData(FormID.PROPERTY_OWNERSHIP);
  const soldPropertySection = getSectionData(FormID.SOLD_PROPERTY);
  const arrearsSection = getSectionData(FormID.ARREARS);
  const breachOfTenancySection = getSectionData(FormID.BREACH_OF_TENANCY);
  const legalRestrictionsSection = getSectionData(FormID.LEGAL_RESTRICTIONS);
  const unspentConvictionsSection = getSectionData(FormID.UNSPENT_CONVICTIONS);

  const employmentSection = getSectionData(FormID.EMPLOYMENT);
  const incomeSavingsSection = getSectionData(FormID.INCOME_SAVINGS);

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

  const addAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAddressToSave({
      address: emptyAddress,
      isEditing: false,
    });
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setAddressToSave({
      address: addresses[addressIndex],
      isEditing: true,
    });
    setEditAddressIndex(addressIndex);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (addressToSave.isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = addressToSave.address;
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, addressToSave.address]);
    }

    setAddressDialogOpen(false);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressToSave({
      ...addressToSave,
      address: {
        ...addressToSave.address,
        [name]: value,
      },
    });
  };

  const deleteAddress = (addressIndex: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(addressIndex, 1);
    setAddresses(newAddresses);
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <HeadingOne content="Add new case" />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Main applicant details
        </h2>
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
                          <FormGroup key={index}>
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
                        <button
                          className={`govuk-button lbh-button govuk-secondary lbh-button--secondary ${
                            addresses.length === 0
                              ? 'lbh-!-margin-top-0 '
                              : 'govuk-secondary lbh-button--secondary'
                          }`}
                          onClick={addAddress}
                        >
                          Add address
                        </button>
                      </SummaryListActions>
                    </SummaryListRow>
                  </SummaryListNoBorder>

                  <Dialog
                    isOpen={addressDialogOpen}
                    title={`${
                      addressToSave.isEditing ? 'Edit' : 'Add'
                    } address`}
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
                          value={addressToSave.address.addressLine1}
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
                          value={addressToSave.address.addressLine2}
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
                          value={addressToSave.address.addressTownCity}
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
                          value={addressToSave.address.addressCounty}
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
                          value={addressToSave.address.addressPostcode}
                          onChange={handleAddressChange}
                        />
                      </FormGroup>

                      <Button onClick={saveAddress}>Save address</Button>
                    </>
                  </Dialog>

                  <AddCaseSection
                    sectionHeading={currentAccommodationSection.sectionHeading}
                    sectionId={currentAccommodationSection.sectionId}
                    sectionData={currentAccommodationSection.fields}
                  />

                  {/* Your situation */}
                  <AddCaseSection
                    sectionHeading={armedForcesSection.sectionHeading}
                    sectionId={armedForcesSection.sectionId}
                    sectionData={armedForcesSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={homelessnessSection.sectionHeading}
                    sectionId={homelessnessSection.sectionId}
                    sectionData={homelessnessSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={propertyOwnwershipSection.sectionHeading}
                    sectionId={propertyOwnwershipSection.sectionId}
                    sectionData={propertyOwnwershipSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={soldPropertySection.sectionHeading}
                    sectionId={soldPropertySection.sectionId}
                    sectionData={soldPropertySection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={arrearsSection.sectionHeading}
                    sectionId={arrearsSection.sectionId}
                    sectionData={arrearsSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={breachOfTenancySection.sectionHeading}
                    sectionId={breachOfTenancySection.sectionId}
                    sectionData={breachOfTenancySection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={legalRestrictionsSection.sectionHeading}
                    sectionId={legalRestrictionsSection.sectionId}
                    sectionData={legalRestrictionsSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={unspentConvictionsSection.sectionHeading}
                    sectionId={unspentConvictionsSection.sectionId}
                    sectionData={unspentConvictionsSection.fields}
                  />

                  <AddCaseSection
                    sectionHeading={employmentSection.sectionHeading}
                    sectionId={employmentSection.sectionId}
                    sectionData={employmentSection.fields}
                  />
                  <AddCaseSection
                    sectionHeading={incomeSavingsSection.sectionHeading}
                    sectionId={incomeSavingsSection.sectionId}
                    sectionData={incomeSavingsSection.fields}
                  />

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
                      onClick={handleSaveApplication}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Save new application
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
