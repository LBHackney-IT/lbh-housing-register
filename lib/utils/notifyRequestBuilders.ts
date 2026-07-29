import { Application } from '../../domain/HousingApi';
import { NotifyRequest } from '../../domain/govukNotify';
import { checkEligible } from './form';
import { applicantsWithMedicalNeed } from './medicalNeed';
import { getDisqualificationReasonOption } from './disqualificationReasonOptions';

// These builders derive the entire NotifyRequest from the application record
// fetched server-side, rather than trusting client-supplied email/reference/
// personalisation values - the caller only chooses which template to send,
// authorised against their own application.
function baseNotifyRequest(
  application: Application,
): Pick<NotifyRequest, 'emailAddress' | 'reference'> {
  return {
    emailAddress:
      application.mainApplicant?.contactInformation?.emailAddress ?? '',
    reference: `${application.reference}`,
  };
}

export function buildNewApplicationNotifyRequest(
  application: Application,
): NotifyRequest {
  return {
    ...baseNotifyRequest(application),
    personalisation: {
      ref_number: application.reference ?? '',
      resident_name: application.mainApplicant?.person?.firstName ?? '',
    },
  };
}

export function buildMedicalNeedNotifyRequest(
  application: Application,
): NotifyRequest {
  return {
    ...baseNotifyRequest(application),
    personalisation: {
      household_members_with_medical_need:
        applicantsWithMedicalNeed(application).toString(),
      resident_name: application.mainApplicant?.person?.firstName ?? '',
    },
  };
}

export function buildDisqualifyNotifyRequest(
  application: Application,
): NotifyRequest {
  const [, reasons] = checkEligible(application);
  const reason = reasons.map(getDisqualificationReasonOption).join(',');

  return {
    ...baseNotifyRequest(application),
    personalisation: {
      ref_number: application.reference ?? '',
      resident_name: application.mainApplicant?.person?.firstName ?? '',
      reason,
    },
  };
}
