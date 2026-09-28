import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('catalog, image, provision, heartbeat, destroy and connection cleanup', async ({
  page,
  request,
}) => {
  await page.goto('/games');
  await expect(
    page.getByRole('heading', { name: 'Doom', exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      (await backendState(request)).requests.some(
        (entry: { path: string }) => entry.path === '/v1/games/doom/image',
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Jogar agora' }).click();
  await expect(page).toHaveURL(/\/play\/doom/);
  await expect(page.getByTitle('Sessão de Doom')).toHaveAttribute(
    'src',
    'http://doom.gamekube.localhost/',
  );
  await expect
    .poll(async () =>
      (await backendState(request)).heartbeats.some(
        (entry: { destination: string; body: string }) =>
          entry.destination === '/app/game.heartbeat' &&
          JSON.parse(entry.body).gameId === 'doom',
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Encerrar sessão' }).click();
  await expect(page).toHaveURL(/\/games$/);
  expect(
    (await backendState(request)).requests.some(
      (entry: { method: string; path: string }) =>
        entry.method === 'DELETE' && entry.path === '/v1/games/doom/instance',
    ),
  ).toBe(true);
  await page.goto('/login');
  await page.context().clearCookies();
  await page.goto('/login');
  await expect
    .poll(async () => (await backendState(request)).closedConnections)
    .toBeGreaterThan(0);
});

test('player rejects external session URLs', async ({ page }) => {
  await page.goto('/play/doom?session=https://evil.example.test');
  await expect(page).toHaveURL(/\/games$/);
});
