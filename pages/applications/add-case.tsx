import Layout from '../../components/layout/staff-layout';
import { UserContext } from '../../lib/contexts/user-context';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../components/button';
import Input from '../../components/form/input';
import DateInput, { INVALID_DATE } from '../../components/form/dateinput';
import Select from '../../components/form/select';

interface PageProps {
  user: HackneyGoogleUser;
}

export default function AddCasePage({ user }: PageProps): JSX.Element {
  const onSubmit = (values: FormikValues) => {
    alert('submitted');
  };

  const citezenshipOptions = [
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
        <Formik initialValues={{}} onSubmit={onSubmit} validationSchema={{}}>
          {({ isSubmitting }) => (
            <Form>
              <table className="govuk-table lbh-table">
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">
                      Personal Details
                    </th>
                    <td className="govuk-table__cell govuk-table__cell">
                      First Name
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Input name="firstName" label="" />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Last Name
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Input name="lastName" label="" />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Ni Number
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Input name="nINumber" label="" />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Date of Birth
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <DateInput
                        name={'dateOfBirth'}
                        label={'Date of birth'}
                        showDay={true}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Phone number
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Input name="phoneNumbner" label="" />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Email
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Input name="email" label="" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="govuk-table lbh-table">
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">
                      Immigration status
                    </th>
                    <td className="govuk-table__cell govuk-table__cell">
                      Citezenship
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'relationshipType'}
                        options={citezenshipOptions.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Study status
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'studyStatus'}
                        options={studyStatusOptions.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Visa status
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'studyStatus'}
                        options={visaStatusOptions.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="govuk-table lbh-table">
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">
                      Residential status
                    </th>
                    <td className="govuk-table__cell govuk-table__cell">
                      3 year residential status
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'threeYearResidentialStatus'}
                        options={threeYearResidentialStatus.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Periods away from Hackney
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'PeriodsAwayFromHackney'}
                        options={PeriodsAwayFromHackneylStatus.map(
                          (options) => ({
                            label: options.label,
                            value: options.value,
                          })
                        )}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Homeless and living in temporary accommodation outside of
                      Hackney
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'homeless'}
                        options={homelessStatus.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Unable to live in the borough due to a court order or
                      injunction
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'injunction'}
                        options={injunctionStatus.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Applicant or partner has served in the armed forces
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'armedForces'}
                        options={armedForcesStatus.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Applicant or partner is a nominee under the National
                      Witness Mobility Scheme
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
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
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Accepted with homeless with main duty
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
                      <Select
                        label=""
                        name={'HomelessWithMainDuty'}
                        options={HomelessWithMainDutyStatus.map((options) => ({
                          label: options.label,
                          value: options.value,
                        }))}
                      />
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell govuk-table__cell"></td>
                    <td className="govuk-table__cell govuk-table__cell">
                      Existing Hackney social tenant with an assured or fixed
                      term tenancy
                    </td>

                    <td className="govuk-table__cell govuk-table__cell">
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
                    </td>
                  </tr>
                </tbody>
              </table>

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
