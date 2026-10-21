import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { Provider } from 'react-redux';

import ApplicationForms from './application-forms';
import application from '../../lib/store/application';
import applicationLoad from '../../lib/store/application-load';
import { hrApiCallsStatus } from '../../lib/store/apiCallsStatus';
import { FormID } from '../../lib/utils/form-data';

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    query: {},
    isReady: true,
    pathname: '/',
  }),
}));

function renderForms(props: ComponentProps<typeof ApplicationForms>) {
  const store = configureStore({
    reducer: {
      application: application.reducer,
      applicationLoad: applicationLoad.reducer,
      hrApiCallsStatus: hrApiCallsStatus.reducer,
    },
  });

  return render(
    <Provider store={store}>
      <ApplicationForms {...props} />
    </Provider>,
  );
}

describe('ApplicationForms', () => {
  const applicant = { person: { id: 'person-1' } };

  it('does not throw when the section is not one of the resident forms', () => {
    renderForms({
      applicant,
      sectionGroups: [],
      activeStep: 'navigation-status',
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText(/Unknown form step/)).not.toBeInTheDocument();
  });

  it('renders a known section', () => {
    renderForms({
      applicant,
      activeStep: FormID.RESIDENTIAL_STATUS,
      sectionGroups: [
        {
          heading: 'Living situation',
          sections: [
            {
              heading: 'Residential status',
              id: FormID.RESIDENTIAL_STATUS,
            },
          ],
        },
      ],
    });

    expect(
      screen.getByRole('heading', { name: 'Residential status' }),
    ).toBeInTheDocument();
  });
});
