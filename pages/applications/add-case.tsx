import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import Input from '../../components/form/input';
import DateInput, { INVALID_DATE } from '../../components/form/dateinput';
import Select from '../../components/form/select';
import SummaryListNoBorder, {
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../../components/summary-list';
import { getFormData, FormID } from '../../lib/utils/form-data';

const personalDetailsFormData = getFormData(FormID.PERSONAL_DETAILS);
const immigrationStatusFormData = getFormData(FormID.IMMIGRATION_STATUS);
console.log(personalDetailsFormData, immigrationStatusFormData);

interface PageProps {
  user: HackneyGoogleUser;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const onSubmit = (values: FormikValues) => {
    console.log('submitted');
  };

  const citizenshipOptions = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const studyStatusOptions = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const visaStatusOptions = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const threeYearResidentialStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const PeriodsAwayFromHackneylStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const homelessStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const injunctionStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const armedForcesStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const nationalWitnessMobilitySchemeStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const HomelessWithMainDutyStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  const existingHackneySocialTenantStatus = [
    {
      label: 'Select an option',
      value: '',
    },
  ];

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
        {/* <ApplicantStep
          applicant={applicant}
          stepName="Personal details"
          formID={FormID.PERSONAL_DETAILS}
        >
          <AddPersonForm
            initialValues={formFields}
            onSubmit={onSubmit}
            isMainApplicant={isMainApplicant}
            buttonText="Save and continue"
            isOver16={isOver16State}
            setIsOver16State={setIsOver16State}
          />
        </ApplicantStep> */}
        <Formik initialValues={{}} onSubmit={onSubmit} validationSchema={{}}>
          {({ isSubmitting }) => (
            <Form>
              <SummaryListNoBorder>
                <SummaryListRow>
                  <SummaryListKey>Personal Details</SummaryListKey>
                  <SummaryListValue>First Name</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Input name="firstName" label="" />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Last Name</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Input name="lastName" label="" />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>NI Number</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Input name="nINumber" label="" />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Date of Birth</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <DateInput
                      name={'dateOfBirth'}
                      label={'Date of birth'}
                      showDay={true}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Phone number</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Input name="phoneNumbner" label="" />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Email</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Input name="email" label="" />
                  </SummaryListActions>
                </SummaryListRow>
              </SummaryListNoBorder>

              <SummaryListNoBorder>
                <SummaryListRow>
                  <SummaryListKey>Immigration status</SummaryListKey>
                  <SummaryListValue>Citizenship</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'relationshipType'}
                      options={citizenshipOptions.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Study status</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'studyStatus'}
                      options={studyStatusOptions.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Visa status</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'studyStatus'}
                      options={visaStatusOptions.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>
              </SummaryListNoBorder>

              <SummaryListNoBorder>
                <SummaryListRow>
                  <SummaryListKey>Residential status</SummaryListKey>
                  <SummaryListValue>3 year residential status</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'threeYearResidentialStatus'}
                      options={threeYearResidentialStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>Periods away from Hackney</SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'PeriodsAwayFromHackney'}
                      options={PeriodsAwayFromHackneylStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Homeless and living in temporary accommodation outside of
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'homeless'}
                      options={homelessStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Unable to live in the borough due to a court order or
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'injunction'}
                      options={injunctionStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Applicant or partner has served in the armed forces
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'armedForces'}
                      options={armedForcesStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Applicant or partner is a nominee under the National Scheme
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'nationalWitnessMobilityScheme'}
                      options={nationalWitnessMobilitySchemeStatus.map(
                        (options) => ({
                          label: options.label,
                          value: options.value,
                        })
                      )}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Accepted with homeless with main duty
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'HomelessWithMainDuty'}
                      options={HomelessWithMainDutyStatus.map((options) => ({
                        label: options.label,
                        value: options.value,
                      }))}
                    />
                  </SummaryListActions>
                </SummaryListRow>

                <SummaryListRow>
                  <SummaryListKey></SummaryListKey>
                  <SummaryListValue>
                    Existing Hackney social tenant with an assured or fixed
                  </SummaryListValue>

                  <SummaryListActions wideActions={true}>
                    <Select
                      label=""
                      name={'existingHackneySocialTenant'}
                      options={existingHackneySocialTenantStatus.map(
                        (options) => ({
                          label: options.label,
                          value: options.value,
                        })
                      )}
                    />
                  </SummaryListActions>
                </SummaryListRow>
              </SummaryListNoBorder>

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
