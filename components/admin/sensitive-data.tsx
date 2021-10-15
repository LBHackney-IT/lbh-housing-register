import { Application } from '../../domain/HousingApi';
import Button from '../button';
import { useState } from 'react';
import { updateApplication } from '../../lib/gateways/internal-api';
import Paragraph from '../content/paragraph';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';

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
      {(user.hasAdminPermissions || user.hasManagerPermissions) && sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(false)}
          secondary={true}
        >
          Mark as not sensitive
        </Button>
      )}
      {(user.hasAdminPermissions || user.hasManagerPermissions) && !sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(true)}
          secondary={true}
        >
          Mark as sensitive
        </Button>
      )}

      {sensitive && (
        <Paragraph>This application has been marked as sensitive.</Paragraph>
      )}
    </>
  );
}
