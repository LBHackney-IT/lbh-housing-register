import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApiCallStatus, ApiCallStatusCode } from '../store/apiCallsStatus';
import { ParsedUrlQueryInput } from 'querystring';

// custom hook to manage the application status and ensure promises are fulfilled before moving to the next page.

interface UseApiCallStatusProps {
  selector: ApiCallStatus | undefined;
  userActionCompleted: boolean;
  pathToPush: string;
  query?: ParsedUrlQueryInput;
  setUserError: (error: string) => void;
  scrollToError: () => void;
}

const useApiCallStatus = ({
  selector,
  userActionCompleted = false,
  setUserError,
  scrollToError,
  pathToPush,
  query,
}: UseApiCallStatusProps) => {
  const router = useRouter();
  const [delayedPendingStatus, setDelayedPendingStatus] = useState<boolean>(
    false
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      selector?.callStatus === ApiCallStatusCode.FULFILLED &&
      userActionCompleted
    ) {
      router.push({
        pathname: pathToPush,
        query,
      });
    }
    if (selector?.callStatus === ApiCallStatusCode.REJECTED) {
      setUserError(selector.error ?? 'API error');
      scrollToError();
    }
    if (selector?.callStatus === ApiCallStatusCode.PENDING) {
      timer = setTimeout(() => {
        setDelayedPendingStatus(true);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [selector?.callStatus]);
  return { delayedPendingStatus };
};

export default useApiCallStatus;
