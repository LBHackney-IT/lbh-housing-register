import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ReactNode } from 'react';

import { Applicant } from '../../domain/HousingApi';
import OtherMembers from './other-members';

jest.mock('lbh-frontend/dialog', () => ({
  __esModule: true,
  default: ({
    isOpen,
    onConfirm,
    children,
  }: {
    isOpen: boolean;
    onConfirm?: () => void;
    children: ReactNode;
  }) =>
    isOpen ? (
      <div>
        {children}
        <button type="button" onClick={onConfirm}>
          Yes
        </button>
      </div>
    ) : null,
}));

const member: Applicant = {
  person: {
    id: 'person-2',
    firstName: 'Ada',
    surname: 'Lovelace',
  },
};

const renderMembers = (
  handleDelete: (applicant: Applicant) => void | Promise<void>,
) =>
  render(
    <OtherMembers
      heading="Other household members"
      others={[member]}
      applicationId="app-1"
      canEdit
      handleDelete={handleDelete}
    />,
  );

const confirmDelete = () => {
  fireEvent.click(
    screen.getByRole('button', { name: 'Remove household member' }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
};

describe('OtherMembers delete confirmation', () => {
  it('ignores confirmations clicked again in short succession', async () => {
    let resolveDelete: () => void = () => undefined;
    const handleDelete = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );

    renderMembers(handleDelete);
    confirmDelete();
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(handleDelete).toHaveBeenCalledTimes(1);

    resolveDelete();
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('allows another confirmation after a failed delete', async () => {
    const handleDelete = jest
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(undefined);

    renderMembers(handleDelete);
    confirmDelete();
    await waitFor(() => expect(handleDelete).toHaveBeenCalledTimes(1));
    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => expect(handleDelete).toHaveBeenCalledTimes(2));
  });
});
