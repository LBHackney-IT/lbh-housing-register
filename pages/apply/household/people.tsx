import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import {
  applicantHasId,
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import {
  FormID,
  getPeopleInApplicationForm,
} from '../../../lib/utils/form-data';

const PeoplePage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();

  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );

  const otherMembers = useAppSelector(
    (store) => store.application.otherMembers || []
  );
  const countOfOtherPeopleInApplication = otherMembers.length ?? 0;

  function confirmResidents(values: FormikValues) {
    if (!applicantHasId(mainApplicant)) {
      throw new Error('mainApplicant missing ID');
    }

    const { firstName, surname, gender, birthday, ...rest } =
      values.mainApplicant;
    dispatch(
      updateApplicant({
        person: {
          id: mainApplicant.person.id,
          firstName,
          surname,
          gender,
          dateOfBirth: birthday,
        },
      })
    );

    dispatch(
      updateWithFormValues({
        formID: FormID.PEOPLE_IN_APPLICATION,
        personID: mainApplicant.person.id,
        values: rest,
      })
    );

    if (countOfOtherPeopleInApplication > 0) {
      Object.entries(values.otherMembers).forEach(
        ([i, values]: [string, any]) => {
          const { firstName, surname, gender, birthday, ...rest } = values;
          const personID = otherMembers[Number(i)].person?.id;
          if (!personID) {
            throw new Error(
              'Missmatched people array, cannot locate person by ID'
            );
          }
          dispatch(
            updateApplicant({
              person: {
                id: personID,
                firstName,
                surname,
                gender,
                dateOfBirth: birthday,
              },
            })
          );
          dispatch(
            updateWithFormValues({
              formID: FormID.PEOPLE_IN_APPLICATION,
              personID,
              values: rest,
            })
          );
        }
      );
    }

    router.push('/apply/overview');
  }

  const formData = getPeopleInApplicationForm(countOfOtherPeopleInApplication);

  return (
    <Layout>
      <HeadingOne content="How many people are in this application?" />
      {/* TODO We need a way to group these. */}
      <Form
        formData={formData}
        buttonText="Save and continue"
        onSubmit={confirmResidents}
      />
    </Layout>
  );
};

export default PeoplePage;
