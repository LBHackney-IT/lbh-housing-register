import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import {
  updateApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import {
  updateAdditionalApplicant,
  updateAdditionalApplicantWithFormValues,
} from '../../../lib/store/otherMembers';
import {
  getPeopleInApplicationForm,
  PEOPLE_IN_APPLICATION,
} from '../../../lib/utils/form-data';

const PeoplePage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();

  const otherMembers = useAppSelector(
    (store) => store.application.otherMembers || []
  );
  const countOfOtherPeopleInApplication = otherMembers.length ?? 0;

  useEffect(() => {
    if (countOfOtherPeopleInApplication === 0) {
      router.replace('.');
    }
  }, []);

  function confirmResidents(values: FormikValues) {
    const { firstName, surname, gender, birthday, ...rest } =
      values.mainApplicant;
    dispatch(
      updateApplicant({
        person: {
          firstName,
          surname,
          gender,
          dateOfBirth: birthday,
        },
      })
    );

    dispatch(
      updateWithFormValues({
        activeStepId: PEOPLE_IN_APPLICATION,
        values: rest,
      })
    );

    Object.entries(values.otherMembers).forEach(
      ([i, values]: [string, any]) => {
        const { firstName, surname, gender, birthday, ...rest } = values;
        const id = otherMembers[Number(i)].person?.id;
        if (!id) {
          throw new Error(
            'Missmatched people array, cannot locate person by ID'
          );
        }
        dispatch(
          updateAdditionalApplicant({
            person: {
              id,
              firstName,
              surname,
              gender,
              dateOfBirth: birthday,
            },
          })
        );
        dispatch(
          updateAdditionalApplicantWithFormValues({
            activeStepId: PEOPLE_IN_APPLICATION,
            id,
            values: rest,
          })
        );
      }
    );

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
