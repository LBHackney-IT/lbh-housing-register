import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/store/application';
import { useAppDispatch } from '../../lib/store/hooks';
import Button from '../button';
import { useState } from 'react';

interface sensitiveDataPageProps {
  id: string;
  isSensitive: boolean;
}

export default function SensitiveData({
  id,
  isSensitive,
}: sensitiveDataPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [sensitive, setSensitive] = useState<boolean>(isSensitive);

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    setSensitive(markAs);
    const request: Application = {
      id: id,
      sensitiveData: markAs,
    };
    dispatch(updateApplication(request));
  };

  return (
    <>
      {sensitive && <h3>This application has been marked as sensitive.</h3>}

      {sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(false)}
          secondary={false}
        >
          Mark as not sensitive
        </Button>
      )}
      {!sensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(true)}
          secondary={false}
        >
          Mark as sensitive
        </Button>
      )}
    </>
  );
}
