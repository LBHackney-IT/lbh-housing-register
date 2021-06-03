import EligibilityOutcome from '../../components/eligibility';
import Layout from '../../components/layout/resident-layout';
import { Store } from '../store';
import { MainResident } from '../types/resident';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const whenEligible = (WrappedComponent: React.ComponentType<any>) => {
  return (props: MainResident) => {
    if (props.isEligible === false) {
      return (
        <Layout>
          <EligibilityOutcome />
        </Layout>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default compose(
  connect((state: Store) => state.resident),
  whenEligible
);
