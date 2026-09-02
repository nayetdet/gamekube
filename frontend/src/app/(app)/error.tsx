'use client';

import { useEffect } from 'react';
import { ErrorPanel } from '@/components/common/error-panel';

export default function AppSectionError({
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
      className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-20"
    />
  );
}
