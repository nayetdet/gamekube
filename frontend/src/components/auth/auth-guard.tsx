'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/providers';
import { LoadingState } from '@/components/ui/async-states';

export function AuthGuard({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, isAdmin } = useAuth();

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status]);

  if (status !== 'authenticated')
    return <LoadingState label="Verificando sua sessão…" />;
  if (requireAdmin && !isAdmin) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-6">
        <section className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-8 text-center">
          <p className="text-sm font-semibold text-amber-200">
            Acesso restrito
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Esta área é exclusiva para administradores.
          </h1>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}
