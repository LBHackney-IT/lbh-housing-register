import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { lookUpAddress } from '../../../lib/gateways/internal-api';
import { ApiCallStatusCode } from '../../../lib/store/apiCallsStatus';
import AddressHistoryPage from '../../../pages/apply/[resident]/address-history';
import { generateApplication } from '../../../testUtils/applicationHelper';

const personId = 'person-1';
const application = generateApplication('app-1', personId, true, false);

const lookUpAddressMock = lookUpAddress as jest.MockedFunction<
  typeof lookUpAddress
>;

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { resident: 'person-1' },
  }),
}));

jest.mock('../../../lib/gateways/internal-api', () => ({
  lookUpAddress: jest.fn(),
}));

jest.mock('../../../components/application/ApplicantStep', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const foundAddress = {
  UPRN: 123,
  line1: '1 Test Street',
  line2: '',
  line3: '',
  line4: '',
  postcode: 'E9 6PT',
  town: 'London',
};

const renderPage = () => {
  const store = configureStore({
    reducer: {
      application: (state = application) => state,
      hrApiCallsStatus: (
        state = {
          updateApplication: {
            callStatus: ApiCallStatusCode.IDLE,
            error: null,
          },
        },
      ) => state,
    },
  });

  return render(
    <Provider store={store}>
      <AddressHistoryPage />
    </Provider>,
  );
};

const submitPostcode = (postcode = 'E9 6PT') => {
  fireEvent.change(screen.getByLabelText('Postcode'), {
    target: { value: postcode },
  });
  fireEvent.click(
    screen.getByTestId(
      'test-apply-resident-address-history-find-address-button',
    ),
  );
};

describe('Apply resident address history page', () => {
  afterEach(() => {
    lookUpAddressMock.mockReset();
  });

  it('falls back to manual entry when lookup throws', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    lookUpAddressMock.mockRejectedValue(
      new Error('Unable to look up address (500)'),
    );

    renderPage();
    submitPostcode('not a UK postcode');

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Select an address'),
    ).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('falls back to manual entry when lookup returns no address list', async () => {
    lookUpAddressMock.mockResolvedValue({
      page_count: 0,
      total_count: 0,
    } as never);

    renderPage();
    submitPostcode();

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Select an address'),
    ).not.toBeInTheDocument();
  });

  it('falls back to manual entry when lookup returns an empty address list', async () => {
    lookUpAddressMock.mockResolvedValue({
      address: [],
      page_count: 0,
      total_count: 0,
    });

    renderPage();
    submitPostcode();

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();
  });

  it('shows the address list when lookup returns matches', async () => {
    lookUpAddressMock.mockResolvedValue({
      address: [foundAddress],
      page_count: 1,
      total_count: 1,
    });

    renderPage();
    submitPostcode();

    expect(
      await screen.findByLabelText('Select an address'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(lookUpAddressMock).toHaveBeenCalledWith('E9 6PT');
    });
  });
});
