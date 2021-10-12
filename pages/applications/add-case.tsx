import { useState } from 'react';
import router from 'next/router';
import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import AddCaseSection from '../../components/admin/AddCaseSection';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  generateInitialValues,
  generateQuestionArray,
} from '../../lib/utils/adminHelpers';
import * as Yup from 'yup';

const keysToIgnore = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
  'DECLARATION',
];

const sections = allFormSections(keysToIgnore);
const initialValues = generateInitialValues(sections);

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  // const [isMainApplicant, setIsMainApplicant] = useState(true);

  const onSubmit = (values: FormikValues) => {
    const questionValues = generateQuestionArray(values);
    const request: Application = {
      id: 'd701748f0851',
      status: 'New',
      createdAt: '',
      submittedAt: '',
      assignedTo: '',
      // isSensitive: false,
      assessment: {
        effectiveDate: '',
        band: '',
        biddingNumber: '',
      },
      mainApplicant: {
        person: {
          id: '',
          // reference: '',
          title: values.personalDetails_title,
          firstName: values.personalDetails_firstName,
          middleName: '',
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
        evidence: [
          {
            id: '',
          },
        ],
        questions: questionValues,
      },
      otherMembers: [],
    };
    createApplication(request);
    router.reload();
  };

  const schema = Yup.object({
    personalDetails_title: Yup.string().label('Title').required(),
    personalDetails_firstName: Yup.string().label('First name').required(),
    personalDetails_surname: Yup.string().label('Surname').required(),
    personalDetails_dateOfBirth: Yup.string().label('Date of birth').required(),
    personalDetails_gender: Yup.string().label('Gender').required(),
    personalDetails_nationalInsuranceNumber: Yup.string()
      .label('NI number')
      .required(),
    immigrationStatus_citizenship: Yup.string().label('Citizenship').required(),
    currentAccommodation_livingSituation: Yup.string()
      .label('Living situation')
      .required(),
  });

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting }) => (
            <Form>
              {sections.map((section, index) => (
                <AddCaseSection
                  key={index}
                  sectionHeading={section.sectionHeading}
                  sectionId={section.sectionId}
                  sectionData={section.fields}
                />
              ))}

              <div className="c-flex__1 text-right">
                <Button disabled={isSubmitting} type="submit">
                  Save new Application
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Layout>
    </UserContext.Provider>
  );
}
