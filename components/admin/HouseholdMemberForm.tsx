import { Form, Formik, FormikValues, FormikErrors } from 'formik';
import { UserContext } from '../../lib/contexts/user-context';
import Button from '../../components/button';
import ErrorSummary from '../../components/errors/error-summary';
import { FormID } from '../../lib/utils/form-data';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import {
  getSectionData,
  generateInitialValues,
  generateEditInitialValues,
  addCaseSchema,
} from '../../lib/utils/adminHelpers';
import AddCaseSection from '../../components/admin/AddCaseSection';
import AddCaseAddress from '../../components/admin/AddCaseAddress';
import AddRelationshipType from '../../components/admin/AddRelationshipType';
import Layout from '../../components/layout/staff-layout';
import { HeadingOne } from '../../components/content/headings';

const personalDetailsSection = getSectionData(FormID.PERSONAL_DETAILS);
const immigrationStatusSection = getSectionData(FormID.IMMIGRATION_STATUS);
const medicalNeedsSection = getSectionData(FormID.MEDICAL_NEEDS);
const addressHistorySection = getSectionData(FormID.ADDRESS_HISTORY);
const employmentSection = getSectionData(FormID.EMPLOYMENT);

interface PageProps {
  isEditing: boolean;
  user: HackneyGoogleUser;
  onSubmit: (values: FormikValues) => void;
  isSubmitted: boolean;
  addresses: any;
  setAddresses: (addresses: any) => void;
  handleSaveApplication: (isValid: boolean, touched: {}) => void;
  personData?: any;
}

export default function HouseholdMemberForm({
  isEditing,
  user,
  onSubmit,
  isSubmitted,
  addresses,
  setAddresses,
  handleSaveApplication,
  personData,
}: PageProps) {
  const initialValues = isEditing
    ? generateEditInitialValues(personData, false)
    : generateInitialValues([
        personalDetailsSection,
        immigrationStatusSection,
        medicalNeedsSection,
        addressHistorySection,
        employmentSection,
      ]);

  const isEditingCopy = isEditing ? 'Edit' : 'Add';
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName={`${isEditingCopy} household member`}>
        <HeadingOne content={`${isEditingCopy} household member`} />
        <h2 className="lbh-caption-xl lbh-caption govuk-!-margin-top-1">
          Household member details
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={addCaseSchema}
        >
          {({ touched, isSubmitting, errors, isValid }) => {
            const isTouched = Object.keys(touched).length !== 0;
            return (
              <>
                {!isValid && isTouched && isSubmitted ? (
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
                  <AddRelationshipType />
                  <AddCaseSection section={immigrationStatusSection} />
                  <AddCaseSection section={medicalNeedsSection} />
                  <AddCaseAddress
                    addresses={addresses}
                    setAddresses={setAddresses}
                    maximumAddresses={1}
                  />
                  <AddCaseSection section={employmentSection} />

                  <div className="c-flex__1 text-right">
                    <Button
                      onClick={() => handleSaveApplication(isValid, touched)}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isEditing
                        ? 'Update household member'
                        : 'Save new household member'}
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
