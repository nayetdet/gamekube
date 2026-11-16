import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('unread badges update when messages arrive and are read', async ({
  page,
  request,
}) => {
  await page.goto('/dashboard');
  const sidebar = page.getByRole('navigation', { name: 'Principal' });
  const sidebarMessages = sidebar.getByRole('link', { name: /Mensagens/ });
  const notifications = page.getByRole('button', {
    name: /Notificações: \d+ pendentes/,
  });
  await expect(sidebarMessages).toContainText('1');
  await expect(notifications).toHaveAttribute(
    'aria-label',
    'Notificações: 2 pendentes',
  );
  await expect
    .poll(async () => (await backendState(request)).heartbeats.length)
    .toBeGreaterThan(0);
  await control(request, 'message', { content: 'Mensagem para notificação' });
  await expect(sidebarMessages).toContainText('2');
  await expect(notifications).toHaveAttribute(
    'aria-label',
    'Notificações: 3 pendentes',
  );
  await sidebarMessages.click();
  await expect(page.getByRole('link', { name: /bob/i })).toContainText(
    'Mensagem para notificação',
  );
  await expect(page.getByRole('link', { name: /bob/i })).toContainText('2');
  await page.getByRole('link', { name: /bob/i }).click();
  await expect(sidebarMessages).not.toContainText('2');
  await expect(notifications).toHaveAttribute(
    'aria-label',
    'Notificações: 1 pendentes',
  );
});

test('filters conversations and sends an emoji in a message', async ({
  page,
}) => {
  await page.goto('/messages');
  const search = page.getByLabel('Pesquisar conversas');
  await search.fill('não existe');
  await expect(page.getByText('Nenhuma conversa encontrada.')).toBeVisible();
  await search.fill('bob');
  await page.getByRole('link', { name: /bob/i }).click();
  const composer = page.getByLabel('Mensagem para @bob');
  await composer.fill('Vamos jogar ');
  await page.getByRole('button', { name: 'Escolher emoji' }).click();
  await page.getByRole('button', { name: 'Inserir 🎮' }).click();
  await expect(composer).toHaveValue('Vamos jogar 🎮');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByText('Vamos jogar 🎮', { exact: true })).toBeVisible();
});

test('chat renders history, sends through the server and receives message/read events', async ({
  page,
  request,
}) => {
  await page.goto('/messages/bob');
  await expect(
    page.getByRole('button', { name: 'Marcar como lidas' }),
  ).toHaveCount(0);
  await expect(page.getByText('Mensagens marcadas como lidas.')).toHaveCount(0);
  await expect(
    page
      .getByRole('list', { name: 'Histórico da conversa' })
      .getByText('Vamos jogar?', { exact: true }),
  ).toBeVisible();
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
    page
      .getByRole('list', { name: 'Histórico da conversa' })
      .getByText('Evento em tempo real', { exact: true }),
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
