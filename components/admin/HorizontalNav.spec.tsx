import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../testUtils/test-utils';
import { HorizontalNavItem } from './HorizontalNav';

describe('HorizontalNavItem', () => {
  it('displays the correct button label', () => {
    const expectedLabel = 'New applications';

    renderWithProviders(
      <HorizontalNavItem itemName={'btn-name'} handleSelectNavItem={jest.fn()}>
        {expectedLabel}
      </HorizontalNavItem>
    );

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });
});
