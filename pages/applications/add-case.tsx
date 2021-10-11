import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import { FormID } from '../../lib/utils/form-data';
import AllFormFieldsMarkup from '../../components/admin/AllFormFieldsMarkup';
import { Application } from '../../domain/HousingApi';
import { createApplication } from '../../lib/gateways/internal-api';
import {
  allFormSections,
  generateInitialValues,
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
  const onSubmit = (values: FormikValues) => {
    console.log(FormID.ACCOMODATION_TYPE);

    // const test = getQuestionsForFormAsValues(FormID.ACCOMODATION_TYPE);

    console.log('submitted: ', values);
    const request: Application = {
      id: '123345678910',
      reference: '31a1de3271',
      status: 'New',
      sensitiveData: true,
      assignedTo: 'thomas.morris@hackney.gov.uk',
      createdAt: '2021-09-14T19:23:42.7573803Z',
      mainApplicant: {
        person: {},
        address: {},
        contactInformation: {},
        questions: [],
      },
      otherMembers: [],
    };
    // console.log(request);

    // createApplication(request);
    // router.reload();
  };

  const schema = Yup.object({
    personalDetails_title: Yup.string().label('Title').required(),
  });

  // const schema = Yup.object({
  //   status: Yup.string()
  //     .label('Status')
  //     .required()
  //     .oneOf(statusOptions.map(({ value }) => value)),
  //   reason: Yup.string()
  //     .label('Reason')
  //     .oneOf(reasonOptions.map(({ value }) => value)),
  //   applicationDate: Yup.string(),
  //   informationReceived: Yup.string(),
  //   band: Yup.string(),
  //   biddingNumberType: Yup.string().oneOf(['generate', 'manual']),
  //   biddingNumber: Yup.string(),
  // });

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
                <AllFormFieldsMarkup
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
