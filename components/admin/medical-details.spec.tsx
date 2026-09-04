import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MedicalDetail from './medical-details';
import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { UserFacingError } from '../../lib/utils/errorHelper';
import { FormID } from '../../lib/utils/form-data';

const mockReload = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ reload: mockReload }),
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
    mockReload.mockReset();
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

  it('reloads once the update succeeds', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(
      <MedicalDetail
        data={application('2026-01-02T00:00:00.000Z')}
        memberIndex={-1}
      />,
    );
    submit();

    await waitFor(() => expect(mockReload).toHaveBeenCalled());
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
    expect(mockReload).not.toHaveBeenCalled();
  });
});
