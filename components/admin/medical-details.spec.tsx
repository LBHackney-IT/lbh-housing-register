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

const edit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

describe('MedicalDetail', () => {
  beforeEach(() => {
    updateApplicationMock.mockReset();
    mockReplace.mockReset().mockResolvedValue(true);
  });

  it('shows the saved details until Edit is clicked', () => {
    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );

    expect(screen.getByText('Assessment requested')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('2 Jan 2026')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save changes' }),
    ).not.toBeInTheDocument();

    edit();

    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument();
  });

  it('returns to the saved details when editing is cancelled', () => {
    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );

    edit();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save changes' }),
    ).not.toBeInTheDocument();
    expect(updateApplicationMock).not.toHaveBeenCalled();
  });

  it('blocks submission when no form received date is set', async () => {
    render(<MedicalDetail data={application('')} memberIndex={-1} />);
    edit();
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('Date form received is a required field'),
      ).toBeInTheDocument();
    });
    expect(updateApplicationMock).not.toHaveBeenCalled();
  });

  it('returns to the saved details after a successful save', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );
    edit();
    fireEvent.change(screen.getByLabelText('Outcome'), {
      target: { value: 'vulnerable' },
    });
    submit();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
    expect(screen.getByText('Vulnerable')).toBeInTheDocument();
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save changes' }),
    ).not.toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith(
      '/applications/view/app-1/person-1?tab=health',
    );
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
    edit();

    const saveButton = screen.getByRole('button', { name: 'Save changes' });
    fireEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeDisabled());
    fireEvent.click(saveButton);

    expect(updateApplicationMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument();

    resolveUpdate({});
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument(),
    );
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
    edit();
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('Unable to update application (400)'),
      ).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: 'Edit' }),
    ).not.toBeInTheDocument();
  });
});
