import { HeadingOne } from '../../../components/content/headings';
import Layout from '../../../components/layout/resident-layout';
import Form from '../../../components/form/form';
import { FormData } from '../../../lib/types/form';
import { getFormData, HOUSEHOLD_OVERVIEW } from '../../../lib/utils/form-data';
import { useRouter } from 'next/router';
import { Store } from '../../../lib/store';
import { useStore } from 'react-redux';
import { updateFormData } from '../../../lib/store/resident';

const HouseHoldPage = (): JSX.Element => {
  const router = useRouter();
  const store = useStore<Store>();
  const resident = store.getState().resident;

  const providedUsername: FormData = {
    email: resident.username,
  };

  const confirmHouseHoldSize = async (values: FormData) => {
    store.dispatch(updateFormData(values));
    router.push('/apply/household/people')
  };


  return (
    <Layout>
      <HeadingOne content="How many people are in this application?" />

      <Form
        formData={getFormData(HOUSEHOLD_OVERVIEW)}
        residentsPreviousAnswers={providedUsername}
        buttonText="Continue"
        onSubmit={confirmHouseHoldSize}
      />
    </Layout>
  );
};

export default HouseHoldPage;
