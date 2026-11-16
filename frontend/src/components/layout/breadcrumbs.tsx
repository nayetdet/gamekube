'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import { routes } from '@/config/routes';

const labels: Record<string, string> = {
  dashboard: 'Visão geral',
  games: 'Jogos',
  friends: 'Amigos',
  requests: 'Pedidos',
  messages: 'Mensagens',
  profile: 'Perfil',
  settings: 'Configurações',
  account: 'Conta',
  privacy: 'Privacidade',
  users: 'Jogadores',
  players: 'Amigos',
};
const gameNames: Record<string, string> = {
  cavestory: 'Cave Story',
  bugdom: 'Bugdom',
  doom: 'DOOM',
  'yume-nikki': 'Yume Nikki',
  hyperdbz: 'Hyper Dragon Ball Z',
  loprincess: 'Legend of Princess',
  off: 'OFF',
  'sonic-triple-trouble': 'Sonic Triple Trouble',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return null;
  const items: { label: string; href: string }[] = [
    { label: 'Início', href: routes.dashboard },
  ];
  if (parts[0] === 'dashboard')
    items.push({ label: 'Visão geral', href: pathname });
  else {
    const parent = parts[0] === 'players' ? routes.friends : `/${parts[0]}`;
    items.push({ label: labels[parts[0]] ?? parts[0], href: parent });
    if (parts[1]) {
      const value = decodeURIComponent(parts[1]);
      const label =
        parts[0] === 'games'
          ? (gameNames[value] ?? value)
          : parts[0] === 'players' ||
              parts[0] === 'users' ||
              parts[0] === 'messages'
            ? `@${value}`
            : (labels[value] ?? value);
      items.push({ label, href: pathname });
    }
  }
  return (
    <nav
      aria-label="Caminho de navegação"
      className="flex w-fit min-w-0 max-w-full items-center gap-2 rounded-full border border-border bg-background/75 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-xl"
    >
      <ol className="flex min-w-0 flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li
            key={`${item.href}-${index}`}
            className="flex min-w-0 items-center gap-2"
          >
            {index > 0 && (
              <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
            )}
            {index === items.length - 1 ? (
              <span
                aria-current="page"
                className="truncate font-medium text-foreground"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
