import { Suspense } from 'react';
import { AuthCallback } from '@/components/auth/auth-callback';

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">
          Concluindo autenticação…
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
