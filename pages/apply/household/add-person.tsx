import { useState } from 'react';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../../components/content/headings';
import Layout from '../../../components/layout/resident-layout';
import { useAppDispatch } from '../../../lib/store/hooks';
import { addResidentFromFormData } from '../../../lib/store/otherMembers';
import { FormData } from '../../../lib/types/form';
import withApplication from '../../../lib/hoc/withApplication';
import AddPersonForm from '../../../components/application/add-person-form';

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = '/apply/household';
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isOver16State, setIsOver16State] = useState(true);

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
  ];

  const formFields = {
    title: '',
    firstName: '',
    surname: '',
    gender: '',
    genderDescription: '',
    dateOfBirth: '',
    nationalInsuranceNumber: '',
    phoneNumber: '',
    emailAddress: '',
  };

  const onSubmit = async (values: FormData) => {
    dispatch(addResidentFromFormData(values));
    router.push(returnHref);
  };

  return (
    <Layout pageName="Add person" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Add a person to this application" />
      <AddPersonForm
        initialValues={formFields}
        onSubmit={onSubmit}
        isMainApplicant={false}
        buttonText="Add person"
        isOver16={isOver16State}
        setIsOver16State={setIsOver16State}
      />
    </Layout>
  );
};

export default withApplication(AddPersonToApplication);
