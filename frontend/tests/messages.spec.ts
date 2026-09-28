import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('chat renders history, sends through the server and receives message/read events', async ({
  page,
  request,
}) => {
  await page.goto('/messages/bob');
  await expect(page.getByText('Vamos jogar?', { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      (await backendState(request)).requests.some(
        (entry: { method: string; path: string }) =>
          entry.method === 'PATCH' && entry.path === '/v1/messages/bob',
      ),
    )
    .toBe(true);
  const composer = page.getByLabel('Mensagem para @bob');
  await composer.fill('Jogo combinado');
  await page
    .getByRole('button', { name: 'Enviar mensagem', exact: true })
    .click();
  await expect(page.getByText('Jogo combinado', { exact: true })).toBeVisible();
  await expect(composer).toHaveValue('');
  await expect(page.getByTitle('Enviada', { exact: true })).toBeVisible();
  await control(request, 'read');
  await expect(page.getByTitle('Lida em', { exact: false })).toBeVisible();
  await control(request, 'message', { content: 'Evento em tempo real' });
  await expect(
    page.getByText('Evento em tempo real', { exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      (await backendState(request)).heartbeats.some(
        (entry: { destination: string }) =>
          entry.destination === '/app/user.heartbeat',
      ),
    )
    .toBe(true);
  const requests = (await backendState(request)).requests;
  expect(
    requests.some((entry: { body: unknown }) =>
      JSON.stringify(entry.body).includes('accessToken'),
    ),
  ).toBe(false);
  await expect(page.locator('body')).not.toContainText('integration-token');
});

test('conversation pagination uses backend page/size and keeps older history', async ({
  page,
  request,
}) => {
  await control(request, 'seed');
  await page.goto('/messages/bob');
  await page.getByRole('link', { name: 'Mensagens anteriores' }).click();
  await expect(page).toHaveURL(/page=1/);
  await expect(page.getByText('Histórico 50', { exact: true })).toBeVisible();
  expect(
    (await backendState(request)).requests.some(
      (entry: { path: string }) =>
        entry.path === '/v1/messages/bob?page=1&size=50',
    ),
  ).toBe(true);
});

test('failed sends preserve the draft and report an error', async ({
  page,
  request,
}) => {
  await control(request, 'fail-send');
  await page.goto('/messages/bob');
  await page.getByLabel('Mensagem para @bob').fill('Não perder este rascunho');
  await page
    .getByRole('button', { name: 'Enviar mensagem', exact: true })
    .click();
  await expect(page.getByLabel('Mensagem para @bob')).toHaveValue(
    'Não perder este rascunho',
  );
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: /instantes|disponível|errado|servidor/i }),
  ).toBeVisible();
});

test('unauthenticated users are redirected and non-admin users cannot enter the directory', async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto('/messages/bob');
  await expect(page).toHaveURL(/\/login/);
  await signIn(context, ['user']);
  await page.goto('/users');
  await expect(page).toHaveURL(/\/dashboard/);
});
