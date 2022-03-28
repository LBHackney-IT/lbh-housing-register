import { Application } from '../../domain/HousingApi';
import Button from '../button';
import { useState } from 'react';
import { updateApplication } from '../../lib/gateways/internal-api';
import Paragraph from '../content/paragraph';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';
import { HeadingFour } from '../content/headings';

interface sensitiveDataPageProps {
  id: string;
  isSensitive: boolean;
  user: HackneyGoogleUserWithPermissions;
}

export default function SensitiveData({
  id,
  isSensitive,
  user,
}: sensitiveDataPageProps): JSX.Element {
  const [sensitive, setSensitive] = useState<boolean>(isSensitive);

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    setSensitive(markAs);
    const request: Application = {
      id: id,
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
        >
          Mark as {sensitive ? 'not' : ''} sensitive
        </button>
      )}
    </>
  );
}
