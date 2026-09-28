'use client';

import { useEffect } from 'react';
import { ErrorPanel } from '@/components/common/error-panel';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPanel
      digest={error.digest}
      reset={reset}
      className="flex flex-1 items-center justify-center px-6 py-24"
    />
  );
}
