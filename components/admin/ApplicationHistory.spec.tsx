import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import router from 'next/router';

import ApplicationHistory from './ApplicationHistory';
import { ActivityHistoryResponse } from '../../domain/ActivityHistoryApi';
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

const historyItem = (
  overrides: Partial<ActivityHistoryResponse> = {},
): ActivityHistoryResponse => ({
  id: 'activity-1',
  targetId: 'app-1',
  createdAt: '2024-01-15T10:00:00.000Z',
  oldData: {},
  newData: {},
  authorDetails: {
    fullName: 'Case Officer',
    email: 'officer@hackney.gov.uk',
  },
  ...overrides,
});

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
    expect(screen.getByRole('button', { name: 'Save note' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
    expect(addNoteToHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('disables save when it is clicked again in short succession', async () => {
    let resolveSave: (value: unknown) => void = () => undefined;
    addNoteToHistoryMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );

    render(<ApplicationHistory history={emptyHistory} id="app-1" />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'A case note' },
    });

    const saveNoteButton = screen.getByRole('button', { name: 'Save note' });
    fireEvent.click(saveNoteButton);

    await waitFor(() => expect(saveNoteButton).toBeDisabled());
    fireEvent.click(saveNoteButton);
    fireEvent.click(saveNoteButton);

    expect(addNoteToHistoryMock).toHaveBeenCalledTimes(1);
    expect(saveNoteButton).toBeDisabled();

    resolveSave([]);
    await waitFor(() => expect(router.reload).toHaveBeenCalledTimes(1));
    fireEvent.click(saveNoteButton);

    expect(addNoteToHistoryMock).toHaveBeenCalledTimes(1);
    expect(saveNoteButton).toBeDisabled();
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

  it('renders a submitted application heading', () => {
    render(
      <ApplicationHistory
        history={{
          results: [
            historyItem({
              newData: { _activityType: 'submittedByResident' },
            }),
          ],
          paginationDetails: { hasNext: false, nextToken: '' },
        }}
        id="app-1"
        showDetails
      />,
    );

    expect(
      screen.getByText('Application submitted by Case Officer'),
    ).toBeInTheDocument();
  });

  it('renders a fallback heading when an activity has no type', () => {
    render(
      <ApplicationHistory
        history={{
          results: [historyItem()],
          paginationDetails: { hasNext: false, nextToken: '' },
        }}
        id="app-1"
        showDetails
      />,
    );

    expect(screen.getByText('Activity recorded')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'History' }),
    ).toBeInTheDocument();
  });

  it('renders a fallback heading when activity data is missing', () => {
    render(
      <ApplicationHistory
        history={{
          results: [historyItem({ oldData: null, newData: null })],
          paginationDetails: { hasNext: false, nextToken: '' },
        }}
        id="app-1"
        showDetails
      />,
    );

    expect(screen.getByText('Activity recorded')).toBeInTheDocument();
  });
});
