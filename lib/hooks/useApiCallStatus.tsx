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
  pendingStatusStateDelay?: number;
}

const useApiCallStatus = ({
  selector,
  userActionCompleted = false,
  setUserError,
  scrollToError,
  pathToPush,
  query,
  pendingStatusStateDelay = 0,
}: UseApiCallStatusProps) => {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (selector?.callStatus === ApiCallStatusCode.PENDING) {
      timer = setTimeout(() => {
        setPendingStatus(true);
      }, pendingStatusStateDelay);
    } else {
      setPendingStatus(false);
      if (timer !== null) {
        clearTimeout(timer);
      }
    }

    if (
      selector?.callStatus === ApiCallStatusCode.FULFILLED &&
      userActionCompleted
    ) {
      router.push({
        pathname: pathToPush,
        query,
      });
    } else if (selector?.callStatus === ApiCallStatusCode.REJECTED) {
      setUserError(selector.error ?? 'API error');
      scrollToError();
    }
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [selector?.callStatus]);
  return { pendingStatus };
};

export default useApiCallStatus;
