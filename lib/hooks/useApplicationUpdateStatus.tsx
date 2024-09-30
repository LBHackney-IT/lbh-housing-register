import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApiCallStatusCode } from '../store/apiCallsStatus';

// custom hook to manage the application status and ensure promises are fulfilled before moving to the next page.

interface UseApplicationUpdateStatusProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: any;
  userActionCompleted?: boolean;
  pathToPush: string;
  setUserError: (error: string) => void;
  scrollToError: () => void;
}

const useApplicationUpdateStatus = ({
  selector,
  userActionCompleted = true,
  setUserError,
  scrollToError,
  pathToPush,
}: UseApplicationUpdateStatusProps) => {
  const router = useRouter();

  useEffect(() => {
    if (
      selector?.callStatus === ApiCallStatusCode.FULFILLED &&
      userActionCompleted
    ) {
      router.push(pathToPush);
    }

    if (selector?.callStatus === ApiCallStatusCode.REJECTED) {
      setUserError(selector.error ?? 'Error patching the application');
      scrollToError();
    }
    // should use all dependencies in this array?
  }, [selector]);
};

export default useApplicationUpdateStatus;
