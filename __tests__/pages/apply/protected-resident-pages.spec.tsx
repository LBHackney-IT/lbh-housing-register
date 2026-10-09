import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { Application } from '../../../domain/HousingApi';
import application from '../../../lib/store/application';
import applicationLoad, {
  ApplicationLoadStatus,
} from '../../../lib/store/application-load';
import { hrApiCallsStatus } from '../../../lib/store/apiCallsStatus';
import AddressHistoryPage, {
  ApplicationStep,
} from '../../../pages/apply/[resident]/address-history';
import ApplicationSection from '../../../pages/apply/[resident]/[section]';
import ResidentLayout from '../../../components/layout/resident-layout';
import { generateApplication } from '../../../testUtils/applicationHelper';

const mockReplace = jest.fn();
const mockRouterState = {
  query: {
    resident: 'person-1',
    section: 'residential-status',
  } as { resident?: string | string[]; section?: string | string[] },
  isReady: true,
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    reload: jest.fn(),
    get query() {
      return mockRouterState.query;
    },
    get isReady() {
      return mockRouterState.isReady;
    },
    pathname: '/apply/[resident]/[section]',
  }),
}));

const applicationFixture = generateApplication(
  'app-1',
  'person-1',
  true,
  false,
);

function makeStore(
  status: ApplicationLoadStatus = 'idle',
  applicationState: Application = {},
) {
  return configureStore({
    reducer: {
      application: application.reducer,
      applicationLoad: applicationLoad.reducer,
      hrApiCallsStatus: hrApiCallsStatus.reducer,
    },
    preloadedState: {
      application: applicationState,
      applicationLoad: { status },
    },
  });
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function renderPage(
  store: EnhancedStore,
  ui: ReactElement = <ApplicationSection />,
) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('protected resident forms', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    mockReplace.mockReset();
    mockRouterState.isReady = true;
    mockRouterState.query = {
      resident: 'person-1',
      section: 'residential-status',
    };
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue(jsonResponse(200, applicationFixture));
  });

  it('shows the residential status form after a signed-in load', async () => {
    renderPage(makeStore());

    expect(screen.getByText('Checking information…')).toBeInTheDocument();
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Residential status' }),
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows the medical needs form after a signed-in load', async () => {
    mockRouterState.query = {
      resident: 'person-1',
      section: 'medical-needs',
    };
    renderPage(makeStore());

    expect(
      await screen.findByRole('heading', { name: 'Medical needs' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Unknown form step/)).not.toBeInTheDocument();
  });

  it('sends a signed-out resident to sign in', async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, { message: 'nope' }));
    renderPage(makeStore());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/apply/sign-in');
    });
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();
    expect(screen.queryByText(/Unknown form step/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Residential status' }),
    ).not.toBeInTheDocument();
  });

  it('shows a retry when the application cannot be loaded', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(500, {}))
      .mockResolvedValue(jsonResponse(200, applicationFixture));

    renderPage(makeStore());

    expect(
      await screen.findByText(
        'We could not load your application. Please try again.',
      ),
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByRole('heading', { name: 'Residential status' }),
    ).toBeInTheDocument();
  });

  it('shows a 404 for an unknown section after the application loads', async () => {
    mockRouterState.query = {
      resident: 'person-1',
      section: 'navigation-status',
    };
    renderPage(makeStore());

    expect(await screen.findByText('404 Page not found')).toBeInTheDocument();
    expect(screen.queryByText(/Unknown form step/)).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows a 404 when the resident is not on the application', async () => {
    mockRouterState.query = {
      resident: 'someone-else',
      section: 'residential-status',
    };
    renderPage(makeStore());

    expect(await screen.findByText('404 Page not found')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('reads a repeated route parameter', async () => {
    mockRouterState.query = {
      resident: ['person-1'],
      section: ['medical-needs'],
    };
    renderPage(makeStore());

    expect(
      await screen.findByRole('heading', { name: 'Medical needs' }),
    ).toBeInTheDocument();
  });

  it('shows a 404 when the section parameter is missing', async () => {
    mockRouterState.query = { resident: 'person-1', section: [] };
    renderPage(makeStore());

    expect(await screen.findByText('404 Page not found')).toBeInTheDocument();
  });

  it('waits for the route before deciding a section is missing', () => {
    mockRouterState.isReady = false;
    renderPage(makeStore('loaded', applicationFixture));

    expect(screen.getByText('Checking information…')).toBeInTheDocument();
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();
  });

  it('does not load or redirect pages that are not protected', () => {
    fetchMock.mockClear();
    renderPage(
      makeStore('unauthenticated'),
      <ResidentLayout pageLoadsApplication={false} pageName="Page not found">
        <p>404 Page not found</p>
      </ResidentLayout>,
    );

    expect(screen.getByText('404 Page not found')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe('address history', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    mockReplace.mockReset();
    mockRouterState.isReady = true;
    mockRouterState.query = { resident: 'person-1' };
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue(jsonResponse(200, applicationFixture));
  });

  it('keeps checking information until the application loads', async () => {
    renderPage(makeStore(), <ApplicationStep />);

    expect(screen.getByText('Checking information…')).toBeInTheDocument();
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Address history' }),
    ).toBeInTheDocument();
  });

  it('sends a signed-out visit to sign in instead of staying on the form', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, {}));
    renderPage(makeStore(), <ApplicationStep />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/apply/sign-in');
    });
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();
  });

  it('waits for the route before treating address history as missing', () => {
    mockRouterState.isReady = false;
    renderPage(makeStore('loaded', applicationFixture), <ApplicationStep />);

    expect(screen.getByText('Checking information…')).toBeInTheDocument();
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();
  });

  it('shows a 404 for a resident who is not on the loaded application', () => {
    mockRouterState.query = { resident: 'someone-else' };
    renderPage(makeStore('loaded', applicationFixture), <ApplicationStep />);

    expect(screen.getByText('404 Page not found')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects the wrapped page when the session load is forbidden', async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, {}));
    renderPage(makeStore(), <AddressHistoryPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/apply/sign-in');
    });
    expect(screen.queryByText('404 Page not found')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Address history' }),
    ).not.toBeInTheDocument();
  });
});
