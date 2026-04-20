import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';
import { HeadingFour } from '../content/headings';

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

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    const request: Application = {
      id,
      sensitiveData: markAs,
    };

    setPending(true);
    try {
      await updateApplication(request);
      // Full reload so getServerSideProps runs and `data` matches the API.
      router.reload();
    } catch {
      setPending(false);
    }
  };

  return (
    <>
      <HeadingFour content="Sensitive data" />
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
