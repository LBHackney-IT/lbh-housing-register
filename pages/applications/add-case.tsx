import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import Input from '../../components/form/input';
import Textarea from '../../components/form/textarea';
import DateInput, { INVALID_DATE } from '../../components/form/dateinput';
import Select from '../../components/form/select';
import SummaryListNoBorder, {
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../../components/summary-list';
import { getFormData, FormID } from '../../lib/utils/form-data';
import { Checkbox } from '../../components/form/checkboxes';

// Helpers

const allFormIds = Object.keys(FormID);

const idsToIgnore = [
  'AGREEMENT',
  'SIGN_IN',
  'SIGN_IN_VERIFY',
  'SIGN_UP_DETAILS',
];

// Form field data
const personalDetailsFormData = getFormData(FormID.PERSONAL_DETAILS);
const immigrationStatusFormData = getFormData(FormID.IMMIGRATION_STATUS);
const residentialStatusFormData = getFormData(FormID.RESIDENTIAL_STATUS);
const addressHistoryFormData = getFormData(FormID.ADDRESS_HISTORY);
const currentAccommodationFormData = getFormData(FormID.CURRENT_ACCOMMODATION);
const homelessnessFormData = getFormData(FormID.HOMELESSNESS);

interface PageProps {
  user: HackneyGoogleUser;
}

function FormFieldsMarkup({ sectionData }: any): JSX.Element {
  // console.log(sectionData);

  const allFormFields = sectionData.steps
    .map((step: any) => step.fields)
    .flat();

  // console.log(allFormFields);

  const markup = allFormFields.map((field: any, index: number) => {
    const inputType = field.as ? field.as : 'text';
    // console.log(field, inputType);

    let inputField: JSX.Element = <></>;

    if (inputType === 'text') {
      inputField = <Input name={field.name} />;
    }

    if (inputType === 'textarea') {
      inputField = <Textarea name={field.name} label="" as="textarea" />;
    }

    if (inputType === 'dateinput') {
      inputField = (
        <DateInput name={field.name} label={field.label} showDay={true} />
      );
    }

    if (inputType === 'checkbox') {
      inputField = <Checkbox name={field.name} label="" value="" />;
    }

    if (
      inputType === 'select' ||
      inputType === 'radioconditional' ||
      inputType === 'radios' ||
      inputType === 'checkboxes'
    ) {
      inputField = (
        <Select
          label=""
          name={field.name}
          options={field.options.map((option: any) => ({
            label: option.label,
            value: option.value,
          }))}
        />
      );
    }

    const title = index === 0 ? sectionData.heading : '';

    return (
      <SummaryListRow>
        <SummaryListKey>{title}</SummaryListKey>
        <SummaryListValue>
          <label htmlFor={field.name}>{field.label}</label>
        </SummaryListValue>
        <SummaryListActions wideActions={true}>{inputField}</SummaryListActions>
      </SummaryListRow>
    );
  });

  return <SummaryListNoBorder>{markup}</SummaryListNoBorder>;
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
        <Formik initialValues={{}} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {allFormIds.map((id) => {
                if (idsToIgnore.includes(id)) {
                  return null;
                }

                return (
                  <FormFieldsMarkup sectionData={getFormData(FormID[id])} />
                );
              })}
              {/* <FormFieldsMarkup sectionData={personalDetailsFormData} />
              <FormFieldsMarkup sectionData={immigrationStatusFormData} />
              <FormFieldsMarkup sectionData={residentialStatusFormData} />
              <FormFieldsMarkup sectionData={addressHistoryFormData} />
              <FormFieldsMarkup sectionData={currentAccommodationFormData} />
              <FormFieldsMarkup sectionData={homelessnessFormData} /> */}

              {/* <SummaryListNoBorder>
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
              </SummaryListNoBorder> */}

              {/* <SummaryListNoBorder>
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
              </SummaryListNoBorder> */}

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
