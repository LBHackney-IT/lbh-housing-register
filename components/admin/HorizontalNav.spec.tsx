import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { HorizontalNavItem } from './HorizontalNav';

describe('HorizontalNavItem', () => {
  it('displays the correct button label', () => {
    const expectedLabel = 'New applications';

    render(
      <HorizontalNavItem itemName={'btn-name'} handleSelectNavItem={jest.fn()}>
        {expectedLabel}
      </HorizontalNavItem>,
    );

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });
});
