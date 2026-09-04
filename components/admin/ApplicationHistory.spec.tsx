import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import router from 'next/router';

import ApplicationHistory from './ApplicationHistory';
import { addNoteToHistory } from '../../lib/gateways/internal-api';
import { UserFacingError } from '../../lib/utils/errorHelper';

jest.mock('next/router', () => ({
  __esModule: true,
  default: { reload: jest.fn() },
}));

jest.mock('../../lib/gateways/internal-api', () => ({
  addNoteToHistory: jest.fn(),
}));

const addNoteToHistoryMock = addNoteToHistory as jest.Mock;

const emptyHistory = {
  results: [],
  paginationDetails: { hasNext: false, nextToken: '' },
};

const saveNote = async () => {
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'A case note' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
};

describe('ApplicationHistory', () => {
  beforeEach(() => {
    addNoteToHistoryMock.mockReset();
    (router.reload as jest.Mock).mockReset();
  });

  it('reloads after a successful save', async () => {
    addNoteToHistoryMock.mockResolvedValue([]);

    render(<ApplicationHistory history={emptyHistory} id="app-1" />);
    await saveNote();

    await waitFor(() => expect(router.reload).toHaveBeenCalled());
  });

  it('shows an error and does not reload when saving a note fails', async () => {
    addNoteToHistoryMock.mockRejectedValue(
      new UserFacingError('Unable to add note (500)'),
    );

    render(<ApplicationHistory history={emptyHistory} id="app-1" />);
    await saveNote();

    await waitFor(() => {
      expect(screen.getByText('Unable to add note (500)')).toBeInTheDocument();
    });
    expect(router.reload).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save note' })).toBeEnabled();
  });
});
