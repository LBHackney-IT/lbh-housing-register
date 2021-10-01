import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { agree } from '../../lib/store/mainApplicant';
import { getFormData, FormID } from '../../lib/utils/form-data';
import Form from '../../components/form/form';
import router from 'next/router';

const ApplicationTermsPage = (): JSX.Element => {
  // TODO: might not be right place for this,
  // but we need to ensure new user is linked to application
  const dispatch = useAppDispatch();
  const applicationId = useAppSelector((store) => store.application.id);

  const onSave = () => {
    if (!applicationId) {
      throw new Error('No application.');
    }

    dispatch(agree());
    router.push('/apply/household');
  };

  return (
    <Layout pageName="Agreement">
      <HeadingOne content="Before you continue" />

      <Paragraph>
        Hackney Council will verify the information you provide, so we can
        assess your housing needs, and eligibility for social housing.
      </Paragraph>

      <Paragraph>
        To do this, we may share your information with credit agencies, local
        authorities, medical professionals and HMRC.
      </Paragraph>

      <Paragraph>
        A Housing Needs and Benefits Officer may need to visit your home without
        advance notice to assess your living situation.
      </Paragraph>

      <Paragraph>
        By selecting I understand and accept below, you're agreeing to let them
        into your home, and understand that Hackney may reject your application
        if you don't.
      </Paragraph>

      <Form
        buttonText="Save and continue"
        formData={getFormData(FormID.AGREEMENT)}
        onSave={onSave}
      />
    </Layout>
  );
};

export default ApplicationTermsPage;
