import { Application } from '../../domain/HousingApi';
import Button from '../button';
import { useState } from 'react';
import { updateApplication } from '../../lib/gateways/internal-api';

interface sensitiveDataPageProps {
  id: string;
  isSensitive: boolean;
}

export default function SensitiveData({
  id,
  isSensitive,
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
      {sensitive && <h3>This application has been marked as sensitive.</h3>}

      {sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(false)}
          secondary={true}
        >
          Mark as not sensitive
        </Button>
      )}
      {!sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(true)}
          secondary={true}
        >
          Mark as sensitive
        </Button>
      )}
    </>
  );
}
