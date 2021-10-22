import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { ApplicationStatus } from '../../lib/types/application-status';

export default function withApplication<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P) => {
    const router = useRouter();
    const { id, status } = useAppSelector((store) => store.application);

    useEffect(() => {
      if (status === ApplicationStatus.DISQUALIFIED) {
        router.push('/apply/not-eligible');
      }
    }, [status]);

    useEffect(() => {
      if (!id) {
        router.push('/');
      }
    }, [id]);

    return <WrappedComponent {...props} />;
  };
}
