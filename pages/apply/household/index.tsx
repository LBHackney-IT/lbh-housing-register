import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { updateWithFormValues } from '../../../lib/store/applicant';
import { useAppDispatch } from '../../../lib/store/hooks';
import { createAdditionalApplicants } from '../../../lib/store/otherMembers';
import { FormID, getFormData } from '../../../lib/utils/form-data';

// TODO: redo all of this: HRT-102

const HouseHoldPage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const confirmHouseHoldSize = async (values: FormikValues) => {
    dispatch(
      updateWithFormValues({ activeStepId: FormID.HOUSEHOLD_OVERVIEW, values })
    );
    dispatch(
      createAdditionalApplicants(parseInt(values.numberInHousehold) - 1)
    );
    router.push('/apply/household/people');
  };

  return (
    <Layout>
      <HeadingOne content="How many people are in this application?" />

      <Form
        formData={getFormData(FormID.HOUSEHOLD_OVERVIEW)}
        buttonText="Continue"
        onSubmit={confirmHouseHoldSize}
      />
    </Layout>
  );
};

export default HouseHoldPage;
