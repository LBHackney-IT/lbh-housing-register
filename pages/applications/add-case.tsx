import { useState } from 'react';
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
  generateInitialValues,
  generateQuestionArray,
} from '../../lib/utils/adminHelpers';
import { INVALID_DATE } from '../../components/form/dateinput';

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

  const scrollToErrors = (errors: any) => {
    const errorKeys = Object.keys(errors);
    if (document.getElementsByName(errorKeys[0])[0]) {
      document.getElementsByName(errorKeys[0])[0].focus();
    }
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting, errors }) => (
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
                <Button
                  onClick={() => scrollToErrors(errors)}
                  disabled={isSubmitting}
                  type="submit"
                >
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
