import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import whenAgreed from '../../lib/hoc/whenAgreed';
import whenEligible from '../../lib/hoc/whenEligible';
import { Store } from '../../lib/store';
import { addResidentFromFormData } from '../../lib/store/additionalResidents';
import { FormData } from '../../lib/types/form';
import { getFormData, PERSONAL_DETAILS } from '../../lib/utils/form-data';
import { useStore } from 'react-redux';
import { useRouter } from 'next/router';
import { updateApplication } from '../../lib/gateways/internal-api';

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = '/apply/overview';
  const router = useRouter();
  const store = useStore<Store>();

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
  ];

  const onSubmit = async (values: FormData) => {
    try {
      store.dispatch(addResidentFromFormData(values));
      const applicants = [
        store.getState().resident,
        ...store.getState().additionalResidents,
      ];
      await updateApplication(applicants, applicants[0].applicationId);
    } catch (err) {
      // TODO: Error handling
    }
    router.push(returnHref);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="Add a person" />
      <Form
        buttonText="Add person"
        formData={getFormData(PERSONAL_DETAILS)}
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default whenAgreed(whenEligible(AddPersonToApplication));
