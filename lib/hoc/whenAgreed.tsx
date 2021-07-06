import ApplicationAgreement from '../../components/application/agreement';
import Layout from '../../components/layout/resident-layout';
import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectHasAgreed } from '../store/applicant';

export default function whenAgreed<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P) => {
    const hasAgreed = useAppSelector(selectHasAgreed);
    if (!hasAgreed) {
      return (
        <Layout>
          <ApplicationAgreement />
        </Layout>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
