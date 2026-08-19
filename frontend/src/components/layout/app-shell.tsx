'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/providers';
import { initials } from '@/lib/format';

function navClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? 'bg-cyan-300/15 text-cyan-100'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#12335e_0,_transparent_28%),linear-gradient(135deg,_#07111f,_#0a1729_50%,_#07111f)] text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/45 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="mr-auto flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-cyan-300 text-lg text-slate-950 shadow-lg shadow-cyan-500/20">
              ▣
            </span>
            <span>GameKube</span>
          </Link>
          <nav
            className="order-3 flex w-full gap-1 sm:order-none sm:w-auto"
            aria-label="Principal"
          >
            <Link
              href="/dashboard"
              className={navClass(pathname === '/dashboard')}
            >
              Jogar
            </Link>
            <Link href="/account" className={navClass(pathname === '/account')}>
              Minha conta
            </Link>
            {isAdmin && (
              <Link
                href="/admin/users"
                className={navClass(pathname.startsWith('/admin'))}
              >
                Usuários
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <span
              className="grid size-8 place-items-center rounded-full bg-violet-400/20 text-xs font-bold text-violet-100"
              aria-hidden="true"
            >
              {initials(user?.name ?? 'G')}
            </span>
            <span className="hidden max-w-28 truncate text-sm text-slate-300 sm:block">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
