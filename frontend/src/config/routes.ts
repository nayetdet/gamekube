export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  friends: '/friends',
  friendRequests: '/friends/requests',
  messages: '/messages',
  conversation: (username: string) =>
    `/messages/${encodeURIComponent(username)}`,
  games: '/games',
  game: (id: string) => `/games/${encodeURIComponent(id)}`,
  play: (slug: string, session: string) =>
    `/play/${encodeURIComponent(slug)}?session=${encodeURIComponent(session)}`,
  profile: '/profile',
  settings: '/settings',
  settingsAccount: '/settings/account',
  settingsPrivacy: '/settings/privacy',
  users: '/users',
  user: (username: string) => `/users/${encodeURIComponent(username)}`,
  player: (username: string) => `/players/${encodeURIComponent(username)}`,
  authLogin: '/auth/login',
  authCallback: '/auth/callback',
  authLogout: '/auth/logout',
} as const;

export const publicRoutes: readonly string[] = [routes.login, '/zz-preview'];

export const authRoutes: readonly string[] = [
  routes.authLogin,
  routes.authCallback,
  routes.authLogout,
];
