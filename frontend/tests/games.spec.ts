import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('opens the catalog from the dashboard and searches games', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await expect(
    page.getByRole('region', { name: 'Jogos em destaque' }),
  ).toContainText('Doom');
  await page.getByRole('link', { name: 'Ver todos', exact: true }).click();
  await page.getByRole('search').getByRole('searchbox').fill('doom');
  await expect(page).toHaveURL(/\/games\?q=doom/);
  await expect(
    page.getByRole('heading', { name: 'Doom', exact: true }),
  ).toBeVisible();
  const catalogSearch = page.getByRole('search');
  await catalogSearch.getByRole('searchbox').fill('inexistente');
  await expect(page.getByText('Nenhum jogo encontrado')).toBeVisible();
  await catalogSearch.getByRole('searchbox').fill('');
  await expect(
    page.getByRole('heading', { name: 'Doom', exact: true }),
  ).toBeVisible();
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

test('opens the featured game details and handles unknown games', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'Ver jogo' }).first().click();
  await expect(page).toHaveURL(/\/games\/doom$/);
  await expect(
    page.getByRole('heading', { name: 'Doom', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Sobre este jogo' }),
  ).toBeVisible();
  await expect(
    page.getByTitle('Vídeo de demonstração de Doom'),
  ).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/5CHEbfDjIKw',
  );
  await expect(page.getByRole('button', { name: 'Jogar agora' })).toBeVisible();
  await page.goto('/games/unknown');
  await expect(
    page.getByRole('heading', { name: 'Não há nada nesta URL' }),
  ).toBeVisible();
});
