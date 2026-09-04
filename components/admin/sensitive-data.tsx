import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { toUserErrorMessage } from '../../lib/utils/errorHelper';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';
import { HeadingFour } from '../content/headings';
import ErrorMessage from '../form/error-message';

interface SensitiveDataPageProps {
  id: string;
  isSensitive: boolean;
  user: HackneyGoogleUserWithPermissions;
}

export default function SensitiveData({
  id,
  isSensitive,
  user,
}: SensitiveDataPageProps): JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [userError, setUserError] = useState<string | undefined>(undefined);

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    const request: Application = {
      id,
      sensitiveData: markAs,
    };

    setPending(true);
    setUserError(undefined);
    try {
      await updateApplication(request);
      // Full reload so getServerSideProps runs and `data` matches the API.
      router.reload();
    } catch (error) {
      setPending(false);
      setUserError(
        toUserErrorMessage(error, 'Unable to update sensitive data status'),
      );
    }
  };

  return (
    <>
      <HeadingFour content="Sensitive data" />
      {userError ? <ErrorMessage message={userError} /> : null}
      {isSensitive && (
        <p className="lbh-body-m lbh-!-margin-top-1">
          This application has been marked as sensitive.
        </p>
      )}
      {(user.hasAdminPermissions || user.hasManagerPermissions) && (
        <button
          type="button"
          onClick={() => updateSensitiveDataStatus(!isSensitive)}
          className="govuk-button lbh-button lbh-button--secondary lbh-!-margin-top-1"
          data-testid="test-sensitive-data-button"
          disabled={pending}
        >
          Mark as {isSensitive ? 'not' : ''} sensitive
        </button>
      )}
    </>
  );
}
