export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  friends: '/friends',
  friendRequests: '/friends/requests',
  games: '/games',
  play: (slug: string, session: string) =>
    `/play/${encodeURIComponent(slug)}?session=${encodeURIComponent(session)}`,
  profile: '/profile',
  users: '/users',
  user: (username: string) => `/users/${encodeURIComponent(username)}`,
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
