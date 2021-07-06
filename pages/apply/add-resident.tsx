import { HeadingOne } from '../../components/content/headings';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import whenAgreed from '../../lib/hoc/whenAgreed';
import { addResidentFromFormData } from '../../lib/store/otherMembers';
import { FormData } from '../../lib/types/form';
import { getFormData, PERSONAL_DETAILS } from '../../lib/utils/form-data';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../../lib/store/hooks';

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = '/apply/overview';
  const router = useRouter();
  const dispatch = useAppDispatch();

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
  ];

  const onSubmit = async (values: FormData) => {
    dispatch(addResidentFromFormData(values));
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

export default whenAgreed(AddPersonToApplication);
