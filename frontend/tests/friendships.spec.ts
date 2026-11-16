import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('friendship request badge updates from realtime events', async ({
  page,
  request,
}) => {
  await page.goto('/dashboard');
  const requestsLink = page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: /Pedidos/ });
  await expect(requestsLink).toContainText('1');
  await expect
    .poll(async () => (await backendState(request)).heartbeats.length)
    .toBeGreaterThan(0);
  await control(request, 'friendship-event', { pending: false });
  await expect(requestsLink).not.toContainText('1');
  await control(request, 'friendship-event', { pending: true });
  await expect(requestsLink).toContainText('1');
});

test('dashboard updates friend presence and current game from websocket events', async ({
  page,
  request,
}) => {
  await page.goto('/dashboard');
  const onlinePanel = page.getByRole('complementary', {
    name: 'Jogos e amigos online',
  });
  await expect(onlinePanel).toContainText('Online agora 1');
  await page.getByRole('button', { name: 'Ver amigos' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('link', { name: /Bob/ })).toBeVisible();
  await expect
    .poll(async () => (await backendState(request)).heartbeats.length)
    .toBeGreaterThan(0);
  await control(request, 'presence', { status: 'ONLINE', game: 'doom' });
  await expect(dialog.getByText('Jogando doom')).toBeVisible();
  await control(request, 'presence', { status: 'OFFLINE' });
  await expect(dialog.getByText('Nenhum amigo online agora.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(onlinePanel).toContainText('Online agora 0');
});

test('friend requests send the new payload and remove an accepted friendship', async ({
  page,
  request,
}) => {
  await page.goto('/friends');
  await page
    .getByRole('button', { name: 'Adicionar amigo', exact: true })
    .click();
  await page.getByLabel('Nome de usuário', { exact: true }).fill('carol');
  await page
    .getByRole('button', { name: 'Enviar pedido', exact: true })
    .click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect((await backendState(request)).requests).toContainEqual({
    method: 'POST',
    path: '/v1/friendships',
    body: { addresseeUsername: 'carol' },
  });
  await page
    .getByRole('button', { name: 'Remover bob dos seus amigos' })
    .click();
  await page.getByRole('button', { name: 'Remover', exact: true }).click();
  await expect
    .poll(async () => (await backendState(request)).friend)
    .toBe(false);
  await page.goto('/messages/bob');
  await expect(page.getByText('Vamos jogar?', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Enviar mensagem', exact: true }),
  ).toHaveCount(0);
});

for (const decision of ['accept', 'reject'] as const) {
  test(`pending requests ${decision} by username with PATCH`, async ({
    page,
    request,
  }) => {
    await page.goto('/friends/requests');
    await page
      .getByRole('button', {
        name: decision === 'accept' ? 'Aceitar pedido' : 'Recusar pedido',
        exact: true,
      })
      .click();
    await expect
      .poll(async () => (await backendState(request)).request)
      .toBe(false);
    expect((await backendState(request)).requests).toContainEqual({
      method: 'PATCH',
      path: `/v1/friendships/carol/${decision}`,
      body: null,
    });
  });
}

test('friends use pages of eight and online modal loads more on scroll', async ({
  page,
  request,
}) => {
  await control(request, 'seed-friends');
  await page.goto('/friends');
  const pagination = page.getByRole('navigation', {
    name: 'Páginas de amigos',
  });
  await expect(pagination).toContainText('1–8 de 15');
  await pagination.getByRole('link', { name: 'Próxima' }).click();
  await expect(pagination).toContainText('9–15 de 15');
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Ver amigos' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('link', { name: /Amigo 00/ })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Amigo 13/ })).toHaveCount(0);
  await dialog.getByRole('link', { name: /Amigo 06/ }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole('link', { name: /Amigo 13/ })).toBeVisible();
});
