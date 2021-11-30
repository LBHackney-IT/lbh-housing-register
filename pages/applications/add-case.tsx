import React, { useState } from 'react';
import router from 'next/router';
import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import Button from '../../components/button';
import AddCaseSection from '../../components/admin/AddCaseSection';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  getSectionData,
  generateInitialValues,
  generateQuestionArray,
  emptyAddress,
  Address,
} from '../../lib/utils/adminHelpers';
import { INVALID_DATE } from '../../components/form/dateinput';
import { scrollToTop } from '../../lib/utils/scroll';
import * as Yup from 'yup';
import ErrorSummary from '../../components/errors/error-summary';
import { FormID } from '../../lib/utils/form-data';
import { HeadingOne } from '../../components/content/headings';
import { ApplicationStatus } from '../../lib/types/application-status';
import AddCaseAddAddress from '../../components/admin/AddCaseAddress';

const keysToOmit = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

const sections = allFormSections(keysToOmit);
const initialValues = generateInitialValues(sections);

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  // const [isMainApplicant, setIsMainApplicant] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState({
    address: emptyAddress as Address,
    isEditing: false,
  });
  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([] as Address[]);

  const onSubmit = (values: FormikValues) => {
    // console.log('Formik values: ', values);

    const questionValues = generateQuestionArray(values, addresses);
    console.log(questionValues);

    const request: Application = {
      status: ApplicationStatus.MANUAL_DRAFT,
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
        },
        address: addresses[0] || null,
        contactInformation: {
          emailAddress: values.personalDetails_emailAddress,
          phoneNumber: values.personalDetails_phoneNumber,
        },
        questions: questionValues,
      },
      otherMembers: [],
      //assignedTo: user.email
    };

    createApplication(request);
    setTimeout(
      () =>
        router.push({
          pathname: '/applications/view-register',
          query: { status: ApplicationStatus.MANUAL_DRAFT },
        }),
      500
    );
  };

  const handleSaveApplication = () => {
    setIsSubmitted(true);
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
    setAddressInDialog({
      address: emptyAddress,
      isEditing: false,
    });
    setAddressDialogOpen(true);
  };

  const editAddress = (addressIndex: number) => {
    setAddressInDialog({
      address: addresses[addressIndex],
      isEditing: true,
    });
    setEditAddressIndex(addressIndex);
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (addressInDialog.isEditing) {
      const newAddresses = [...addresses];
      newAddresses[editAddressIndex] = addressInDialog.address;
      setAddresses(newAddresses);
    } else {
      setAddresses([...addresses, addressInDialog.address]);
    }

    setAddressDialogOpen(false);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressInDialog({
      ...addressInDialog,
      address: {
        ...addressInDialog.address,
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
                {!isValid && isSubmitted ? (
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
                  <AddCaseSection section={personalDetailsSection} />
                  <AddCaseSection section={immigrationStatusSection} />
                  <AddCaseSection section={medicalNeedsSection} />
                  <AddCaseSection section={residentialStatusSection} />

                  <AddCaseAddAddress
                    addresses={addresses}
                    addressInDialog={addressInDialog}
                    addressDialogOpen={addressDialogOpen}
                    addAddress={addAddress}
                    editAddress={editAddress}
                    deleteAddress={deleteAddress}
                    setAddressDialogOpen={setAddressDialogOpen}
                    handleAddressChange={handleAddressChange}
                    saveAddress={saveAddress}
                  />

                  <AddCaseSection section={currentAccommodationSection} />

                  {/* Your situation */}
                  <AddCaseSection section={armedForcesSection} />
                  <AddCaseSection section={homelessnessSection} />
                  <AddCaseSection section={propertyOwnwershipSection} />
                  <AddCaseSection section={soldPropertySection} />
                  <AddCaseSection section={arrearsSection} />
                  <AddCaseSection section={breachOfTenancySection} />
                  <AddCaseSection section={legalRestrictionsSection} />
                  <AddCaseSection section={unspentConvictionsSection} />

                  <AddCaseSection section={employmentSection} />
                  <AddCaseSection section={incomeSavingsSection} />

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
