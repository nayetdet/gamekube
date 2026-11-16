'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationHistory() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (
      previous.current !== null &&
      previous.current !== pathname &&
      !popped.current
    ) {
      window.history.replaceState(
        { ...window.history.state, gamekubeCanGoBack: true },
        '',
      );
    }
    previous.current = pathname;
    popped.current = false;
  }, [pathname]);
  return null;
}
