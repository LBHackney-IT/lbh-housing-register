import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/store/application';
import { useAppDispatch } from '../../lib/store/hooks';
import Button from '../button';
import { useRouter } from 'next/router';

interface sensitiveDataPageProps {
  id: string;
  isSensitive: boolean;
}

export default function SensitiveData({
  id,
  isSensitive,
}: sensitiveDataPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const updateSensitiveDataStatus = async (markAs: boolean) => {
    const request: Application = {
      id: id,
      sensativeData: markAs,
    };
    dispatch(updateApplication(request));

    router.push(`/applications/view/${id}`);
  };

  return (
    <>
      {isSensitive && (
        <Button
          onClick={() => updateSensitiveDataStatus(false)}
          secondary={true}
        >
          Mark as not sensitive
        </Button>
      )}
      {!isSensitive && (
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
