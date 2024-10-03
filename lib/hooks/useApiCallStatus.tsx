import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApiCallStatus, ApiCallStatusCode } from '../store/apiCallsStatus';
import { ParsedUrlQueryInput } from 'querystring';

// custom hook to manage the application status and ensure promises are fulfilled before moving to the next page.

interface UseApplicationUpdateStatusProps {
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
}: UseApplicationUpdateStatusProps) => {
  const router = useRouter();

  useEffect(() => {
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
  }, [selector?.callStatus]);
};

export default useApiCallStatus;
