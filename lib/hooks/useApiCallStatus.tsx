import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApiCallStatus, ApiCallStatusCode } from '../store/apiCallsStatus';
import { ParsedUrlQueryInput } from 'querystring';

// custom hook to manage the application status and ensure promises are fulfilled before moving to the next page.

interface UseApiCallStatusProps {
  selector: ApiCallStatus | undefined;
  userActionCompleted: boolean;
  pathToPush: string | null;
  query?: ParsedUrlQueryInput;
  setUserError: (error: string) => void;
  scrollToError: () => void;
  pendingStatusStateDelay?: number;
  clearPendingStatus?: boolean;
}

const useApiCallStatus = ({
  selector,
  userActionCompleted = false,
  setUserError,
  scrollToError,
  pathToPush,
  query,
  pendingStatusStateDelay = 0,
  clearPendingStatus = false,
}: UseApiCallStatusProps) => {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  let timer: NodeJS.Timeout;

  useEffect(() => {
    if (selector?.callStatus === ApiCallStatusCode.PENDING) {
      timer = setTimeout(() => {
        setPendingStatus(true);
      }, pendingStatusStateDelay);
    } else {
      if (clearPendingStatus) {
        setPendingStatus(false);
      }
      clearTimeout(timer);
    }

    if (
      selector?.callStatus === ApiCallStatusCode.FULFILLED &&
      userActionCompleted &&
      pathToPush
    ) {
      router.push({
        pathname: pathToPush,
        query,
      });
    } else if (selector?.callStatus === ApiCallStatusCode.REJECTED) {
      setPendingStatus(false);
      setUserError(selector.error ?? 'API error');
      scrollToError();
    }
  }, [selector?.callStatus]);
  return { pendingStatus };
};

export default useApiCallStatus;
