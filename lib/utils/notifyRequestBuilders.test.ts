import { Application } from '../../domain/HousingApi';
import {
  buildDisqualifyNotifyRequest,
  buildMedicalNeedNotifyRequest,
  buildNewApplicationNotifyRequest,
} from './notifyRequestBuilders';
import { checkEligible } from './form';
import { applicantsWithMedicalNeed } from './medicalNeed';
import {
  DisqualificationReason,
  getDisqualificationReasonOption,
} from './disqualificationReasonOptions';

jest.mock('./form', () => ({
  checkEligible: jest.fn(),
}));

jest.mock('./medicalNeed', () => ({
  applicantsWithMedicalNeed: jest.fn(),
}));

jest.mock('./disqualificationReasonOptions', () => ({
  getDisqualificationReasonOption: jest.fn(),
}));

const checkEligibleMock = checkEligible as jest.Mock;
const applicantsWithMedicalNeedMock = applicantsWithMedicalNeed as jest.Mock;
const getDisqualificationReasonOptionMock =
  getDisqualificationReasonOption as jest.Mock;

const baseApplication: Application = {
  id: 'application-id',
  reference: 'REF123',
  mainApplicant: {
    person: { firstName: 'Jane' },
    contactInformation: { emailAddress: 'jane@example.com' },
  },
};

describe('notifyRequestBuilders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    checkEligibleMock.mockReturnValue([true, []]);
    applicantsWithMedicalNeedMock.mockReturnValue(0);
    getDisqualificationReasonOptionMock.mockImplementation(
      (reason: DisqualificationReason) => `readable(${reason})`,
    );
  });

  describe('buildNewApplicationNotifyRequest', () => {
    it('derives emailAddress, reference and personalisation from the application', () => {
      expect(buildNewApplicationNotifyRequest(baseApplication)).toStrictEqual({
        emailAddress: 'jane@example.com',
        reference: 'REF123',
        personalisation: {
          ref_number: 'REF123',
          resident_name: 'Jane',
        },
      });
    });

    it('falls back to empty strings when the applicant email or name are missing', () => {
      const application: Application = { id: 'application-id' };

      expect(buildNewApplicationNotifyRequest(application)).toStrictEqual({
        emailAddress: '',
        reference: 'undefined',
        personalisation: {
          ref_number: '',
          resident_name: '',
        },
      });
    });
  });

  describe('buildMedicalNeedNotifyRequest', () => {
    it('includes the count of household members with a medical need', () => {
      applicantsWithMedicalNeedMock.mockReturnValue(2);

      expect(buildMedicalNeedNotifyRequest(baseApplication)).toStrictEqual({
        emailAddress: 'jane@example.com',
        reference: 'REF123',
        personalisation: {
          household_members_with_medical_need: '2',
          resident_name: 'Jane',
        },
      });
      expect(applicantsWithMedicalNeedMock).toHaveBeenCalledWith(
        baseApplication,
      );
    });

    it('falls back to an empty resident_name when the applicant name is missing', () => {
      const application: Application = { id: 'application-id' };

      expect(
        buildMedicalNeedNotifyRequest(application).personalisation,
      ).toStrictEqual(expect.objectContaining({ resident_name: '' }));
    });
  });

  describe('buildDisqualifyNotifyRequest', () => {
    it('joins the human-readable disqualification reasons from checkEligible', () => {
      checkEligibleMock.mockReturnValue([
        false,
        ['under18YearsOld', 'incomeOver80000'] as DisqualificationReason[],
      ]);

      const result = buildDisqualifyNotifyRequest(baseApplication);

      expect(checkEligibleMock).toHaveBeenCalledWith(baseApplication);
      expect(
        getDisqualificationReasonOptionMock.mock.calls.map((c) => c[0]),
      ).toStrictEqual(['under18YearsOld', 'incomeOver80000']);
      expect(result).toStrictEqual({
        emailAddress: 'jane@example.com',
        reference: 'REF123',
        personalisation: {
          ref_number: 'REF123',
          resident_name: 'Jane',
          reason: 'readable(under18YearsOld),readable(incomeOver80000)',
        },
      });
    });

    it('sends an empty reason when there are no disqualification reasons', () => {
      checkEligibleMock.mockReturnValue([true, []]);

      const result = buildDisqualifyNotifyRequest(baseApplication);

      expect((result.personalisation as { reason: string }).reason).toBe('');
    });

    it('falls back to empty ref_number and resident_name when the application data is missing', () => {
      const application: Application = { id: 'application-id' };

      expect(
        buildDisqualifyNotifyRequest(application).personalisation,
      ).toStrictEqual(
        expect.objectContaining({ ref_number: '', resident_name: '' }),
      );
    });
  });
});
