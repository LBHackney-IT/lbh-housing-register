import { useRouter } from 'next/router';
import React from 'react';
import { useAppSelector } from '../store/hooks';

export default function withApplication<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P) => {
    const router = useRouter();
    const application = useAppSelector((store) => store.application);
    if (!application) {
      router.push('/');
    }

    return <WrappedComponent {...props} />;
  };
}
