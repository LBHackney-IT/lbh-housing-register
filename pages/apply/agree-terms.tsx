import Layout from '../../components/layout/resident-layout';
import whenEligible from '../../lib/hoc/whenEligible';
import ApplicationAgreement from '../../components/application/agreement';

const ApplicationTermsPage = (): JSX.Element => {
  return (
    <Layout>
      <ApplicationAgreement />
    </Layout>
  );
};

export default whenEligible(ApplicationTermsPage);
