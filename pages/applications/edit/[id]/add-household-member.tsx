import React, { useState, SyntheticEvent } from 'react';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { HeadingOne } from '../../../../components/content/headings';
import Button from '../../../../components/button';
import Layout from '../../../../components/layout/staff-layout';
import { Application } from '../../../../domain/HousingApi';
import { UserContext } from '../../../../lib/contexts/user-context';
import { getApplication } from '../../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../../lib/utils/googleAuth';
import Custom404 from '../../../404';
import { HackneyGoogleUser } from '../../../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import AddCaseSection from '../../../../components/admin/AddCaseSection';
import { updateApplication } from '../../../../lib/gateways/internal-api';
import {
  getSectionData,
  generateInitialValues,
  generateQuestionArray,
  emptyAddress,
  Address,
} from '../../../../lib/utils/adminHelpers';
import { INVALID_DATE } from '../../../../components/form/dateinput';
import { scrollToTop } from '../../../../lib/utils/scroll';
import * as Yup from 'yup';
import ErrorSummary from '../../../../components/errors/error-summary';
import { FormID } from '../../../../lib/utils/form-data';
import { ApplicationStatus } from '../../../../lib/types/application-status';
import AddCaseAddAddress from '../../../../components/admin/AddCaseAddress';

const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
const addressHistorySection = getSectionData(FormID.ADDRESS_HISTORY);
const employmentSection = getSectionData(FormID.EMPLOYMENT);

const initialValues = generateInitialValues([
  personalDetailsSection,
  immigrationStatusSection,
  medicalNeedsSection,
  addressHistorySection,
  employmentSection,
]);

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddHouseholdMember({
  user,
  data,
}: PageProps): JSX.Element | null {
  if (!data.id) return <Custom404 />;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressInDialog, setAddressInDialog] = useState({
    address: emptyAddress as Address,
    isEditing: false,
  });
  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([] as Address[]);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values, addresses);

    const newMember = {
      person: {
        title: values.personalDetails_title,
        firstName: values.personalDetails_firstName,
        surname: values.personalDetails_surname,
        dateOfBirth: values.personalDetails_dateOfBirth,
        gender: values.personalDetails_gender,
        genderDescription: '',
        nationalInsuranceNumber: values.personalDetails_nationalInsuranceNumber,
      },
      address: addresses[0] || null,
      contactInformation: {
        emailAddress: values.personalDetails_emailAddress,
        phoneNumber: values.personalDetails_phoneNumber,
      },
      questions: questionValues,
    };

    if (data.otherMembers) {
      data.otherMembers = [...data.otherMembers, newMember];
    }

    const request: Application = {
      id: data.id,
      otherMembers: data.otherMembers,
    };

    updateApplication(request);
    setTimeout(
      () =>
        router.push({
          pathname: `/applications/view/${data.id}`,
        }),
      500
    );
  };

  const handleSaveApplication = () => {
    setIsSubmitted(true);
    scrollToTop();
  };

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
      <Layout pageName="Add household member">
        <HeadingOne content="Add new case" />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Household member details
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
                  <AddCaseSection section={employmentSection} />

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

        {/* {data.sensitiveData &&
        !canViewSensitiveApplication(data.assignedTo!, user) ? (
          <>
            <h2>Access denied</h2>
            <Paragraph>You are unable to view this application.</Paragraph>
          </>
        ) : (
          <>
            <HeadingOne content="View application" />
            <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
              {getPersonName(data)}
            </h2>

            <HorizontalNav spaced={true}>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="overview"
                isActive={activeNavItem === 'overview'}
              >
                Overview
              </HorizontalNavItem>
              {data.status !== ApplicationStatus.DRAFT ? (
                <HorizontalNavItem
                  handleClick={handleClick}
                  itemName="assessment"
                  isActive={activeNavItem === 'assessment'}
                >
                  Assessment
                </HorizontalNavItem>
              ) : (
                <></>
              )}
            </HorizontalNav>

            {activeNavItem === 'overview' && (
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                  <HeadingThree content="Snapshot" />
                  <Snapshot data={data} />
                  {data.mainApplicant && (
                    <PersonalDetails
                      heading="Main applicant"
                      applicant={data.mainApplicant}
                      applicationId={data.id}
                    />
                  )}
                  {data.otherMembers && data.otherMembers.length > 0 ? (
                    <OtherMembers
                      heading="Other household members"
                      others={data.otherMembers}
                      applicationId={data.id}
                    />
                  ) : (
                    <HeadingThree content="Other household members" />
                  )}
                  <Button onClick={() => {}} secondary={true}>
                    + Add household member
                  </Button>
                </div>
                <div className="govuk-grid-column-one-third">
                  <HeadingThree content="Case details" />

                  <CaseDetailsItem
                    itemHeading="Application reference"
                    itemValue={data.reference}
                  />

                  {data.assessment?.biddingNumber && (
                    <CaseDetailsItem
                      itemHeading="Bidding number"
                      itemValue={data.assessment?.biddingNumber}
                    />
                  )}

                  <CaseDetailsItem
                    itemHeading="Status"
                    itemValue={lookupStatus(data.status!)}
                    buttonText="Change"
                    onClick={() => setActiveNavItem('assessment')}
                  />

                  <CaseDetailsItem
                    itemHeading="Date submitted"
                    itemValue={formatDate(data.submittedAt)}
                  />

                  {data.assessment?.effectiveDate && (
                    <CaseDetailsItem
                      itemHeading="Application date"
                      itemValue={formatDate(data.assessment?.effectiveDate)}
                      buttonText="Change"
                      onClick={() => setActiveNavItem('assessment')}
                    />
                  )}

                  {data.assessment?.band && (
                    <CaseDetailsItem
                      itemHeading="Band"
                      itemValue={`Band ${data.assessment?.band}`}
                      buttonText="Change"
                      onClick={() => setActiveNavItem('assessment')}
                    />
                  )}

                  <AssignUser
                    id={data.id}
                    user={user}
                    assignee={data.assignedTo}
                  />

                  <SensitiveData
                    id={data.id}
                    isSensitive={data.sensitiveData || false}
                    user={user}
                  />
                </div>
              </div>
            )}
            {activeNavItem === 'assessment' && <Actions data={data} />}
          </>
        )} */}
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  const { id } = context.params as {
    id: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { user, data } };
};
