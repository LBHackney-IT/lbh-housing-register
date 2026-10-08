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

const mockRouter = {
  push: jest.fn(),
  query: { resident: 'person-1' } as { resident?: string },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../../../lib/gateways/internal-api', () => ({
  lookUpAddress: jest.fn(),
}));

jest.mock('../../../components/application/ApplicantStep', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('../../../components/layout/resident-layout', () => ({
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
    mockRouter.query = { resident: 'person-1' };
  });

  it('shows a 404 when the loaded application does not include the resident', () => {
    mockRouter.query = { resident: 'someone-else' };

    renderPage();

    expect(
      screen.getByRole('heading', { name: '404 Page not found' }),
    ).toBeInTheDocument();
  });

  it('stays on postcode entry when lookup throws', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    lookUpAddressMock.mockRejectedValue(
      new Error('Unable to look up address (500)'),
    );

    renderPage();
    submitPostcode('E9 6PT');

    expect(
      await screen.findByText(
        'We could not look up that postcode. Enter a known postcode, or enter the address manually.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Select an address'),
    ).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('does not treat an unexpected error as a failed lookup', async () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    lookUpAddressMock.mockRejectedValue(new Error('UPRN is missing'));

    renderPage();
    submitPostcode('E9 6PT');

    await waitFor(() => {
      expect(consoleWarn).toHaveBeenCalled();
    });
    expect(
      screen.queryByText(
        'We could not look up that postcode. Enter a known postcode, or enter the address manually.',
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Postcode')).toBeInTheDocument();
    consoleWarn.mockRestore();
  });

  it('stays on postcode entry when lookup returns no address list', async () => {
    lookUpAddressMock.mockResolvedValue({
      page_count: 0,
      total_count: 0,
    } as never);

    renderPage();
    submitPostcode();

    expect(
      await screen.findByText(
        'We could not find any addresses for that postcode. Enter a known postcode, or enter the address manually.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Select an address'),
    ).not.toBeInTheDocument();
  });

  it('stays on postcode entry when lookup returns an empty address list', async () => {
    lookUpAddressMock.mockResolvedValue({
      address: [],
      page_count: 0,
      total_count: 0,
    });

    renderPage();
    submitPostcode();

    expect(
      await screen.findByText(
        'We could not find any addresses for that postcode. Enter a known postcode, or enter the address manually.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
  });

  it('opens manual entry without requiring a postcode', async () => {
    renderPage();
    expect(
      screen.queryByRole('button', { name: 'Save and continue' }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('link', { name: 'Enter your address manually' }),
    );

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Postcode (optional)')).toHaveValue('');
    expect(lookUpAddressMock).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(
      await screen.findByText('Building and street is a required field'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Postcode is a required field'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Enter a full UK postcode'),
    ).not.toBeInTheDocument();
  });

  it('returns to postcode lookup from manual entry', async () => {
    renderPage();
    fireEvent.click(
      screen.getByRole('link', { name: 'Enter your address manually' }),
    );

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('link', {
        name: 'Search for an address using a postcode',
      }),
    );

    expect(await screen.findByLabelText('Postcode')).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'test-apply-resident-address-history-find-address-button',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save and continue' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
  });

  it('shows a field error and does not look up a partial postcode', async () => {
    renderPage();
    submitPostcode('E8');

    expect(
      await screen.findByText('Enter a full UK postcode'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
    expect(lookUpAddressMock).not.toHaveBeenCalled();
  });

  it('looks up a postcode written with different case and punctuation', async () => {
    lookUpAddressMock.mockResolvedValue({
      address: [foundAddress],
      page_count: 1,
      total_count: 1,
    });

    renderPage();
    submitPostcode('(e9) 6pt');

    expect(
      await screen.findByLabelText('Select an address'),
    ).toBeInTheDocument();
    expect(lookUpAddressMock).toHaveBeenCalledWith('(e9) 6pt');
  });

  it('validates the move date when saving an address, not when selecting one', async () => {
    lookUpAddressMock.mockResolvedValue({
      address: [
        foundAddress,
        { ...foundAddress, UPRN: 456, line1: '2 Test Street' },
      ],
      page_count: 1,
      total_count: 2,
    });

    renderPage();
    submitPostcode();

    fireEvent.change(await screen.findByLabelText('Select an address'), {
      target: { value: '456' },
    });

    expect(
      screen.queryByText(
        'When did you move to this address is a required field',
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(
      await screen.findByText(
        'When did you move to this address is a required field',
      ),
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
