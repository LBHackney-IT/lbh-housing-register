import React, { useState } from 'react';

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
  const [sensitive, setSensitive] = useState<boolean>(isSensitive);

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    setSensitive(markAs);
    const request: Application = {
      id,
      sensitiveData: markAs,
    };
    updateApplication(request);
  };

  return (
    <>
      <HeadingFour content="Sensitive data" />
      {sensitive && (
        <p className="lbh-body-m lbh-!-margin-top-1">
          This application has been marked as sensitive.
        </p>
      )}
      {(user.hasAdminPermissions || user.hasManagerPermissions) && (
        <button
          onClick={() => updateSensitiveDataStatus(!sensitive)}
          className="govuk-button lbh-button lbh-button--secondary lbh-!-margin-top-1"
          data-testid="test-sensitive-data-button"
        >
          Mark as {sensitive ? 'not' : ''} sensitive
        </button>
      )}
    </>
  );
}
