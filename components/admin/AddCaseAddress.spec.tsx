import { fireEvent, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';

import AddCaseAddress, { firstOfMonthIso } from './AddCaseAddress';

jest.mock('lbh-frontend/dialog', () => ({
  __esModule: true,
  default: ({
    isOpen,
    children,
    title,
  }: {
    isOpen: boolean;
    children: ReactNode;
    title?: string;
  }) =>
    isOpen ? (
      <div>
        {title}
        {children}
      </div>
    ) : null,
}));

const namedInput = (name: string) =>
  document.querySelector(`input[name="${name}"]`) as HTMLInputElement;

const typeNamed = (name: string, value: string) =>
  fireEvent.change(namedInput(name), { target: { name, value } });

const address = (line1: string) => ({
  address: {
    line1,
    line2: '',
    town: '',
    county: '',
    postcode: '',
  },
  date: '',
  dateTo: '',
});

describe('firstOfMonthIso', () => {
  it('returns empty when month or year is missing', () => {
    expect(firstOfMonthIso('', '1')).toBe('');
    expect(firstOfMonthIso('2020', '')).toBe('');
  });

  it('returns empty for values that are not a real calendar month', () => {
    expect(firstOfMonthIso('2020', 'x')).toBe('');
    expect(() => firstOfMonthIso('2020', 'x')).not.toThrow();
  });

  it('returns an ISO string for a real month and year', () => {
    expect(firstOfMonthIso('2020', '1')).toMatch(/^2020-01/);
  });
});

describe('AddCaseAddress', () => {
  it('does not crash when editing an address and only the to-date is filled', () => {
    const setAddresses = jest.fn();

    render(
      <AddCaseAddress
        addresses={[
          {
            address: {
              line1: '1 High Street',
              line2: '',
              town: '',
              county: '',
              postcode: '',
            },
            date: '',
            dateTo: '',
          },
        ]}
        setAddresses={setAddresses}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Edit' }));
    typeNamed('dateToMonth', '1');

    expect(() => typeNamed('dateToYear', '2020')).not.toThrow();

    fireEvent.click(screen.getByTestId('test-save-case-address-button'));

    expect(setAddresses).toHaveBeenCalledWith([
      expect.objectContaining({
        date: '',
        dateTo: expect.stringMatching(/^2020-01/),
      }),
    ]);
  });

  it('saves from and to dates independently', () => {
    const setAddresses = jest.fn();

    render(<AddCaseAddress addresses={[]} setAddresses={setAddresses} />);

    fireEvent.click(screen.getByTestId('test-add-case-address-button'));
    typeNamed('dateMonth', '6');
    typeNamed('dateYear', '2019');
    typeNamed('dateToMonth', '1');
    typeNamed('dateToYear', '2020');
    fireEvent.click(screen.getByTestId('test-save-case-address-button'));

    expect(setAddresses).toHaveBeenCalledWith([
      expect.objectContaining({
        date: expect.stringMatching(/^2019-0[56]/),
        dateTo: expect.stringMatching(/^2020-01/),
        address: expect.not.objectContaining({
          dateMonth: expect.anything(),
          dateYear: expect.anything(),
          dateToMonth: expect.anything(),
          dateToYear: expect.anything(),
        }),
      }),
    ]);
  });

  it('removes an address when Delete is clicked', () => {
    const setAddresses = jest.fn();

    render(
      <AddCaseAddress
        addresses={[address('1 High Street'), address('2 Low Street')]}
        setAddresses={setAddresses}
      />,
    );

    fireEvent.click(screen.getAllByRole('link', { name: 'Delete' })[0]);

    expect(setAddresses).toHaveBeenCalledWith([address('2 Low Street')]);
  });

  it('hides Add address once maximumAddresses is reached', () => {
    const { rerender } = render(
      <AddCaseAddress
        addresses={[]}
        setAddresses={jest.fn()}
        maximumAddresses={1}
      />,
    );

    expect(
      screen.getByTestId('test-add-case-address-button'),
    ).toBeInTheDocument();

    rerender(
      <AddCaseAddress
        addresses={[address('1 High Street')]}
        setAddresses={jest.fn()}
        maximumAddresses={1}
      />,
    );

    expect(
      screen.queryByTestId('test-add-case-address-button'),
    ).not.toBeInTheDocument();
  });

  it('shows an address-history error next to Add address', () => {
    render(
      <AddCaseAddress
        addresses={[]}
        setAddresses={jest.fn()}
        error="Address is a required field"
      />,
    );

    expect(screen.getByText('Address is a required field')).toBeInTheDocument();
    expect(
      screen.getByTestId('test-add-case-address-button'),
    ).toBeInTheDocument();
  });

  it('appends on add and replaces the edited index on save', () => {
    const setAddresses = jest.fn();

    const { rerender } = render(
      <AddCaseAddress addresses={[]} setAddresses={setAddresses} />,
    );

    fireEvent.click(screen.getByTestId('test-add-case-address-button'));
    typeNamed('line1', '1 High Street');
    fireEvent.click(screen.getByTestId('test-save-case-address-button'));

    expect(setAddresses).toHaveBeenCalledWith([
      expect.objectContaining({
        address: expect.objectContaining({ line1: '1 High Street' }),
      }),
    ]);

    const existing = [address('1 High Street'), address('2 Low Street')];
    rerender(
      <AddCaseAddress addresses={existing} setAddresses={setAddresses} />,
    );

    fireEvent.click(screen.getAllByRole('link', { name: 'Edit' })[1]);
    typeNamed('line1', '3 New Street');
    fireEvent.click(screen.getByTestId('test-save-case-address-button'));

    expect(setAddresses).toHaveBeenLastCalledWith([
      address('1 High Street'),
      expect.objectContaining({
        address: expect.objectContaining({ line1: '3 New Street' }),
      }),
    ]);
    expect(setAddresses.mock.calls.at(-1)?.[0]).toHaveLength(2);
  });
});
