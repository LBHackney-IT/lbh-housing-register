import ApplicationAgreement from '../../components/application/agreement';
import Layout from '../../components/layout/resident-layout';

const ApplicationTermsPage = (): JSX.Element => {
  return (
    <Layout pageName="Agreement">
      <ApplicationAgreement />
    </Layout>
  );
};

export default ApplicationTermsPage;
