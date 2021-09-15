import { useRouter } from 'next/router';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { useAppDispatch } from '../../../lib/store/hooks';
import { addResidentFromFormData } from '../../../lib/store/otherMembers';
import { FormData } from '../../../lib/types/form';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import withApplication from '../../../lib/hoc/withApplication';

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = '/apply/household';
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
    <Layout pageName="Add person" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Add a person to this application" />
      <Form
        buttonText="Add person"
        formData={getFormData(FormID.NEW_PERSON_DETAILS)}
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default withApplication(AddPersonToApplication);
