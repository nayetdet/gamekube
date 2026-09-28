import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
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
