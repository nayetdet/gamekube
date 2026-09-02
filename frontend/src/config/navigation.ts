import {
  Gamepad2,
  LayoutDashboard,
  MailQuestion,
  Users,
  UserRound,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { routes } from '@/config/routes';

export type NavItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export type NavGroup = {
  label: string;
  items: readonly NavItem[];
};

export const navigation: readonly NavGroup[] = [
  {
    label: 'Jogar',
    items: [
      {
        label: 'Visão geral',
        description: 'Sua presença, amigos e sessões num relance',
        href: routes.dashboard,
        icon: LayoutDashboard,
      },
      {
        label: 'Jogos',
        description: 'Inicie uma nova sessão de jogo',
        href: routes.games,
        icon: Gamepad2,
      },
    ],
  },
  {
    label: 'Social',
    items: [
      {
        label: 'Amigos',
        description: 'Todos com quem você joga',
        href: routes.friends,
        icon: Users,
      },
      {
        label: 'Pedidos',
        description: 'Pedidos de amizade pendentes',
        href: routes.friendRequests,
        icon: MailQuestion,
      },
    ],
  },
  {
    label: 'Conta',
    items: [
      {
        label: 'Perfil',
        description: 'Seu perfil público e configurações da conta',
        href: routes.profile,
        icon: UserRound,
      },
      {
        label: 'Diretório',
        description: 'Veja todos os jogadores cadastrados',
        href: routes.users,
        icon: ShieldCheck,
        adminOnly: true,
      },
    ],
  },
];

export const navItems: readonly NavItem[] = navigation.flatMap(
  (group) => group.items,
);

export function findActiveItem(pathname: string): NavItem | undefined {
  return navItems
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}
