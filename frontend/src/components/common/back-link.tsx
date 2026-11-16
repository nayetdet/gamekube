'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { fallback: string };

export function BackLink({ fallback, onClick, ...props }: Props) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        if (window.history.state?.gamekubeCanGoBack) {
          event.preventDefault();
          router.back();
        }
      }}
    />
  );
}
