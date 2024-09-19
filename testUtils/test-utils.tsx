import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';

import { makeStore } from '../lib/store';

import type { AppStore, RootState } from '../lib/store';
import type { RenderOptions } from '@testing-library/react';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    store = makeStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;
  // Automatically create a store instance if no store was passed in
  // const Wrapper({ children }: PropsWithChildren<{}>) JSX.Element {
  //   return <Provider store={store}>{children}</Provider>;
  // }
  const Wrapper = ({ children }: PropsWithChildren<unknown>) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
