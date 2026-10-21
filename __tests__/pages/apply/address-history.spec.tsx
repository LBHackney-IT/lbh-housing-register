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
  isReady: true,
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
      applicationLoad: (state = { status: 'loaded' }) => state,
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
    if (application.mainApplicant) {
      application.mainApplicant.questions = undefined;
    }
  });

  it('shows a saved address as stacked lines without a postcode heading', () => {
    application.mainApplicant!.questions = [
      {
        id: 'address-history/addressHistory',
        answer: JSON.stringify([
          {
            postcode: 'bn115rg',
            date: '2020-01-01',
            dateTo: '',
            address: {
              line1: '18 Arundel Mews',
              line2: '',
              town: 'Worthing',
              county: 'West Sussex',
            },
          },
        ]),
      },
    ];

    renderPage();

    const address = screen.getByText('18 Arundel Mews').closest('p');
    expect(address).toHaveTextContent('18 Arundel Mews');
    expect(address).toHaveTextContent('Worthing');
    expect(address).toHaveTextContent('West Sussex');
    expect(screen.getByText('BN11 5RG')).toBeInTheDocument();
    expect(address?.querySelector('br')).toBeNull();
    const lines = address?.querySelectorAll('.lbh-address__line') ?? [];
    expect(lines).toHaveLength(4);
    expect(screen.queryByText('Postcode')).not.toBeInTheDocument();
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
      screen.getByRole('button', { name: 'Enter your address manually' }),
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
      screen.queryByText('Enter a valid UK postcode'),
    ).not.toBeInTheDocument();
  });

  it('returns to postcode lookup from manual entry', async () => {
    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Enter your address manually' }),
    );

    expect(
      await screen.findByRole('heading', { name: 'What is your address?' }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
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
      await screen.findByText('Enter a valid UK postcode'),
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

    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '6' },
    });
    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '20' },
    });
    fireEvent.blur(screen.getByLabelText('Month'));
    fireEvent.blur(screen.getByLabelText('Year'));

    expect(screen.queryByText('Invalid date')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/When did you move to this address must be/),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '' },
    });

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

  it('does not validate the move month and year until save is attempted', async () => {
    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Enter your address manually' }),
    );

    const month = await screen.findByLabelText('Month');
    const year = screen.getByLabelText('Year');

    fireEvent.change(month, { target: { value: '12' } });
    fireEvent.change(year, { target: { value: '20' } });
    fireEvent.blur(month);
    fireEvent.blur(year);

    expect(screen.queryByText('Invalid date')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'When did you move to this address is a required field',
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(year, { target: { value: '2099' } });
    fireEvent.blur(year);

    expect(
      screen.queryByText(/When did you move to this address must be/),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(
      await screen.findByText(/When did you move to this address must be/),
    ).toBeInTheDocument();
  });

  it('does not validate the leave month and year until save is attempted', async () => {
    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Enter your address manually' }),
    );

    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '1 Test Street' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.town'), {
      target: { value: 'London' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.county'), {
      target: { value: 'Greater London' },
    });
    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '6' },
    });
    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '2024' },
    });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Enter your address manually',
      }),
    );

    const months = await screen.findAllByLabelText('Month');
    const years = screen.getAllByLabelText('Year');
    const leaveMonth = months[1];
    const leaveYear = years[1];

    fireEvent.change(leaveMonth, { target: { value: '13' } });
    fireEvent.change(leaveYear, { target: { value: '2024' } });
    fireEvent.blur(leaveMonth);
    fireEvent.blur(leaveYear);

    expect(screen.queryByText('Invalid date')).not.toBeInTheDocument();
    expect(
      screen.queryByText('When did you leave this address is a required field'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'When did you leave this address must be June 2024 or before',
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(
      await screen.findByText(
        'When did you leave this address must be June 2024 or before',
      ),
    ).toBeInTheDocument();
  });

  const saveManualCurrentAddress = async () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Enter your address manually' }),
    );

    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '1 Current Street' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.town'), {
      target: { value: 'London' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.county'), {
      target: { value: 'Greater London' },
    });
    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '6' },
    });
    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '2024' },
    });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );
  };

  it('edits an address saved during the flow without clearing it', async () => {
    renderPage();
    await saveManualCurrentAddress();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Change current address' }),
    );

    const line1 = await screen.findByTestId('test-input-address.line1');
    expect(line1).toHaveValue('1 Current Street');
    expect(screen.getByLabelText('Month')).toHaveValue('6');
    expect(screen.getByLabelText('Year')).toHaveValue('2024');
    fireEvent.change(line1, { target: { value: '9 Current Street' } });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(await screen.findByText('9 Current Street')).toBeInTheDocument();
    expect(screen.queryByText('1 Current Street')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Postcode')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Change current address' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Update address' }),
    ).not.toBeInTheDocument();
  });

  it('edits one reviewed address and keeps the others', async () => {
    application.mainApplicant!.questions = [
      {
        id: 'address-history/addressHistory',
        answer: JSON.stringify([
          {
            postcode: 'E8 1AA',
            date: '2024-06-01',
            dateTo: '',
            address: {
              line1: '1 Current Street',
              line2: '',
              town: 'London',
              county: 'Greater London',
            },
          },
          {
            postcode: 'E5 0AA',
            date: '2020-01-01',
            dateTo: '2024-06-01',
            address: {
              line1: '2 Old Road',
              line2: '',
              town: 'London',
              county: 'Greater London',
            },
          },
        ]),
      },
    ];

    renderPage();

    expect(
      screen.queryByRole('button', { name: 'Update address' }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Change current address' }),
    );
    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '9 Current Street' },
    });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(await screen.findByText('9 Current Street')).toBeInTheDocument();
    expect(screen.getByText('2 Old Road')).toBeInTheDocument();
    expect(screen.queryByText('1 Current Street')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/When did you move to this address must be/),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Change previous address' }),
    );
    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '3 Old Road' },
    });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(await screen.findByText('3 Old Road')).toBeInTheDocument();
    expect(screen.getByText('9 Current Street')).toBeInTheDocument();
    expect(screen.queryByText('2 Old Road')).not.toBeInTheDocument();
  });

  it('cancels an address edit without changing saved addresses', async () => {
    application.mainApplicant!.questions = [
      {
        id: 'address-history/addressHistory',
        answer: JSON.stringify([
          {
            postcode: 'E8 1AA',
            date: '2024-06-01',
            dateTo: '',
            address: {
              line1: '1 Current Street',
              line2: '',
              town: 'London',
              county: 'Greater London',
            },
          },
          {
            postcode: 'E5 0AA',
            date: '2020-01-01',
            dateTo: '2024-06-01',
            address: {
              line1: '2 Old Road',
              line2: '',
              town: 'London',
              county: 'Greater London',
            },
          },
        ]),
      },
    ];

    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Change previous address' }),
    );
    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '3 Old Road' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('1 Current Street')).toBeInTheDocument();
    expect(screen.getByText('2 Old Road')).toBeInTheDocument();
    expect(screen.queryByText('3 Old Road')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
  });

  const savedEntry = (line1: string, date: string, dateTo: string) => ({
    postcode: 'E8 1AA',
    date,
    dateTo,
    address: {
      line1,
      line2: '',
      town: 'London',
      county: 'Greater London',
    },
  });

  const saveHistory = (entries: ReturnType<typeof savedEntry>[]) => {
    application.mainApplicant!.questions = [
      {
        id: 'address-history/addressHistory',
        answer: JSON.stringify(entries),
      },
    ];
  };

  const clickSave = () =>
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

  it('does not offer another address once five years are covered', () => {
    saveHistory([savedEntry('1 Current Street', '2015-01-01', '')]);

    renderPage();

    expect(
      screen.queryByRole('button', { name: /Add another address/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Postcode')).not.toBeInTheDocument();
  });

  it('rejects a leave date before the move date', async () => {
    renderPage();
    await saveManualCurrentAddress();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Enter your address manually',
      }),
    );
    fireEvent.change(await screen.findByTestId('test-input-address.line1'), {
      target: { value: '2 Old Road' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.town'), {
      target: { value: 'London' },
    });
    fireEvent.change(screen.getByTestId('test-input-address.county'), {
      target: { value: 'Greater London' },
    });
    const months = screen.getAllByLabelText('Month');
    const years = screen.getAllByLabelText('Year');
    fireEvent.change(months[0], { target: { value: '1' } });
    fireEvent.change(years[0], { target: { value: '2021' } });
    fireEvent.change(months[1], { target: { value: '2' } });
    fireEvent.change(years[1], { target: { value: '1999' } });
    clickSave();

    expect(
      await screen.findByText(
        'When did you leave this address must be the same as or after when you moved to this address',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('2 Old Road')).not.toBeInTheDocument();
  });

  it('rejects moving the current address before the previous one ended', async () => {
    saveHistory([
      savedEntry('1 Current Street', '2024-06-01', ''),
      savedEntry('2 Old Road', '2015-01-01', '2024-06-01'),
    ]);

    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Change current address' }),
    );
    fireEvent.change(await screen.findByLabelText('Year'), {
      target: { value: '2022' },
    });
    clickSave();

    expect(
      await screen.findByText(
        'When did you move to this address must be June 2024 or after, when you left your previous address',
      ),
    ).toBeInTheDocument();
  });

  it('removes a previous address and asks for the missing history', async () => {
    saveHistory([
      savedEntry('1 Current Street', '2024-06-01', ''),
      savedEntry('2 Old Road', '2015-01-01', '2024-06-01'),
    ]);

    renderPage();
    expect(
      screen.queryByRole('button', { name: 'Remove current address' }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove previous address' }),
    );

    expect(screen.queryByText('2 Old Road')).not.toBeInTheDocument();
    expect(screen.getByText('1 Current Street')).toBeInTheDocument();
    expect(await screen.findByLabelText('Postcode')).toHaveValue('');
  });

  it('edits an address in its place in the list', async () => {
    saveHistory([
      savedEntry('1 Current Street', '2024-06-01', ''),
      savedEntry('2 Old Road', '2022-01-01', '2024-06-01'),
      savedEntry('3 Older Road', '2015-01-01', '2022-01-01'),
    ]);

    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Change previous address' }),
    );

    const line1 = await screen.findByTestId('test-input-address.line1');
    const current = screen.getByText('1 Current Street');
    const older = screen.getByText('3 Older Road');
    expect(
      current.compareDocumentPosition(line1) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      line1.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(document.activeElement).toBe(line1);
  });

  it('drops older addresses that an edit makes unnecessary', async () => {
    saveHistory([
      savedEntry('1 Current Street', '2024-06-01', ''),
      savedEntry('2 Old Road', '2022-01-01', '2024-06-01'),
      savedEntry('3 Older Road', '2015-01-01', '2019-01-01'),
    ]);

    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Change previous address' }),
    );
    fireEvent.change((await screen.findAllByLabelText('Year'))[0], {
      target: { value: '2020' },
    });
    clickSave();

    expect(await screen.findByText('2 Old Road')).toBeInTheDocument();
    expect(screen.queryByText('3 Older Road')).not.toBeInTheDocument();
  });

  it('edits a looked-up address without asking for a county', async () => {
    application.mainApplicant!.questions = [
      {
        id: 'address-history/addressHistory',
        answer: JSON.stringify([
          {
            postcode: 'E9 6PT',
            date: '2020-01-01',
            dateTo: '',
            address: {
              UPRN: 123,
              line1: '1 Test Street',
              line2: '',
              line3: 'Hackney',
              line4: '',
              postcode: 'E9 6PT',
              town: 'London',
            },
          },
        ]),
      },
    ];

    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Change current address' }),
    );

    expect(await screen.findByLabelText('County (optional)')).toHaveValue('');
    fireEvent.change(screen.getByTestId('test-input-address.line1'), {
      target: { value: '9 Test Street' },
    });
    fireEvent.click(
      screen.getByTestId(
        'test-apply-resident-address-history-save-and-continue-button',
      ),
    );

    expect(await screen.findByText('9 Test Street')).toBeInTheDocument();
    expect(screen.getByText('Hackney')).toBeInTheDocument();
    expect(
      screen.queryByText('County is a required field'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'What is your address?' }),
    ).not.toBeInTheDocument();
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
