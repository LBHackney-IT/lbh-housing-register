import * as Sentry from '@sentry/nextjs';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../lib/store/hooks';
import SentryContext, { getSentrySurface } from './sentry-context';

jest.mock('@sentry/nextjs', () => ({
  setTag: jest.fn(),
  setUser: jest.fn(),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../lib/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));

const setTag = Sentry.setTag as jest.Mock;
const setUser = Sentry.setUser as jest.Mock;
const useRouterMock = useRouter as jest.Mock;
const useAppSelectorMock = useAppSelector as jest.Mock;

const routerEvents = {
  on: jest.fn(),
  off: jest.fn(),
};

describe('SentryContext', () => {
  beforeEach(() => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({ application: { id: 'resident-app-id' } }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['/applications/view/[id]', 'staff'],
    ['/apply/[resident]/personal-details', 'resident'],
    ['/login', 'public'],
  ])('maps %s to the %s surface', (route, surface) => {
    expect(getSentrySurface(route)).toBe(surface);
  });

  it('sets opaque staff identity and route context', () => {
    useRouterMock.mockReturnValue({
      pathname: '/applications/view/[id]',
      query: { id: 'staff-app-id' },
      events: routerEvents,
    });

    render(<SentryContext staffCognitoSub="opaque-cognito-sub" />);

    expect(setTag).toHaveBeenCalledWith('route', '/applications/view/[id]');
    expect(setTag).toHaveBeenCalledWith('surface', 'staff');
    expect(setTag).toHaveBeenCalledWith('auth_provider', 'cognito');
    expect(setTag).toHaveBeenCalledWith('application_id', 'staff-app-id');
    expect(setUser).toHaveBeenCalledWith({
      id: 'cognito:opaque-cognito-sub',
    });
  });

  it('uses Hackney JWT application context for resident identity', () => {
    useRouterMock.mockReturnValue({
      pathname: '/apply/overview',
      query: {},
      events: routerEvents,
    });

    render(<SentryContext />);

    expect(setTag).toHaveBeenCalledWith('surface', 'resident');
    expect(setTag).toHaveBeenCalledWith('auth_provider', 'hackney-jwt');
    expect(setTag).toHaveBeenCalledWith('application_id', 'resident-app-id');
    expect(setUser).toHaveBeenCalledWith({
      id: 'resident-application:resident-app-id',
    });
  });

  it('updates staff context when a route change starts', () => {
    const handlers = new Map<string, (url: string) => void>();
    useRouterMock.mockReturnValue({
      pathname: '/login',
      query: {},
      events: {
        on: (event: string, handler: (url: string) => void) => {
          handlers.set(event, handler);
        },
        off: jest.fn(),
      },
    });

    render(<SentryContext />);
    handlers.get('routeChangeStart')?.(
      '/applications/view/staff-app-id?search=name',
    );

    expect(setTag).toHaveBeenCalledWith('surface', 'staff');
    expect(setTag).toHaveBeenCalledWith('application_id', 'staff-app-id');

    handlers.get('routeChangeStart')?.('/apply/overview');
    expect(setTag).toHaveBeenCalledWith('surface', 'resident');
    expect(setTag).toHaveBeenCalledWith('application_id', 'resident-app-id');

    handlers.get('routeChangeStart')?.('/login');
    expect(setTag).toHaveBeenCalledWith('application_id', undefined);
    expect(setUser).toHaveBeenCalledWith(null);
  });
});
