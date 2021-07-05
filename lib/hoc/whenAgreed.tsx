import ApplicationAgreement from '../../components/application/agreement';
import Layout from '../../components/layout/resident-layout';
import { Store } from '../store';
import { MainResident } from '../types/resident';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const whenAgreed = (WrappedComponent: React.ComponentType<any>) => {
  return (props: MainResident) => {
    if (!props.hasAgreed) {
      return (
        <Layout>
          <ApplicationAgreement />
        </Layout>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default compose(
  connect((state: Store) => state.resident),
  whenAgreed
);
