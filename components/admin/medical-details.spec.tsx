import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MedicalDetail from './medical-details';
import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { UserFacingError } from '../../lib/utils/errorHelper';
import { FormID } from '../../lib/utils/form-data';

const mockReplace = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    asPath: '/applications/view/app-1/person-1?tab=health',
  }),
}));

jest.mock('../../lib/gateways/internal-api', () => ({
  updateApplication: jest.fn(),
}));

jest.mock('../../lib/utils/scroll', () => ({
  scrollToTop: jest.fn(),
}));

const updateApplicationMock = updateApplication as jest.Mock;

const medicalNeedQuestions = [
  { id: `${FormID.MEDICAL_NEEDS}/medical-needs`, answer: '"yes"' },
];

const application = (formRecieved: string): Application => ({
  id: 'app-1',
  mainApplicant: {
    person: { id: 'person-1' },
    questions: medicalNeedQuestions,
    medicalNeed: { formRecieved },
  },
  otherMembers: [],
});

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

describe('MedicalDetail', () => {
  beforeEach(() => {
    updateApplicationMock.mockReset();
    mockReplace.mockReset().mockResolvedValue(true);
  });

  it('blocks submission when no form received date is set', async () => {
    render(<MedicalDetail data={application('')} memberIndex={-1} />);
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('Date form received is a required field'),
      ).toBeInTheDocument();
    });
    expect(updateApplicationMock).not.toHaveBeenCalled();
  });

  it('shows a saving spinner until the current tab is refreshed', async () => {
    let resolveUpdate: (value: unknown) => void = () => undefined;
    updateApplicationMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );
    submit();

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: 'Save changes' }),
    ).not.toBeInTheDocument();

    resolveUpdate({});

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        '/applications/view/app-1/person-1?tab=health',
      ),
    );
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(updateApplicationMock).toHaveBeenCalledTimes(1);
  });

  it('ignores further clicks while a save is in progress', async () => {
    let resolveUpdate: (value: unknown) => void = () => undefined;
    updateApplicationMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );

    const saveButton = screen.getByRole('button', { name: 'Save changes' });
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
    expect(updateApplicationMock).toHaveBeenCalledTimes(1);

    resolveUpdate({});
    await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));
  });

  it('shows an error and does not reload when the update fails', async () => {
    updateApplicationMock.mockRejectedValue(
      new UserFacingError('Unable to update application (400)'),
    );

    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('Unable to update application (400)'),
      ).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
});
