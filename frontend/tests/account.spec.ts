import { test, expect } from '@playwright/test';
import { signIn, backendState, control } from './fixtures/auth';

test.beforeEach(async ({ context, request }) => {
  await control(request, 'reset');
  await signIn(context);
});

test('profile editing and email update consume current endpoints', async ({
  page,
  request,
}) => {
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Editar nome de exibição' }).click();
  await page.locator('input[name="name"]').fill('Alice atualizada');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect
    .poll(async () => (await backendState(request)).name)
    .toBe('Alice atualizada');
  await page
    .getByRole('button', { name: 'Enviar link para alterar e-mail' })
    .click();
  await expect
    .poll(async () =>
      (await backendState(request)).requests.some(
        (entry: { method: string; path: string }) =>
          entry.method === 'PATCH' && entry.path === '/v1/users/alice/email',
      ),
    )
    .toBe(true);
});

test('directory consumes paging, descending sort, presence and date filters', async ({
  page,
  request,
}) => {
  await page.goto(
    '/users?status=ONLINE&lastSeenAtAfter=2026-09-01&lastSeenAtBefore=2026-09-28&createdAfter=2026-01-01&createdBefore=2026-09-28&orderBy=-lastSeenAt&pageSize=20',
  );
  await expect(
    page.getByRole('heading', { name: 'Diretório de jogadores' }),
  ).toBeVisible();
  const entries = (await backendState(request)).requests.filter(
    (entry: { path: string }) => entry.path.startsWith('/v1/users?'),
  );
  const query = new URL(entries.at(-1).path, 'http://backend.test')
    .searchParams;
  expect(Object.fromEntries(query)).toMatchObject({
    status: 'ONLINE',
    lastSeenAtAfter: '2026-09-01',
    lastSeenAtBefore: '2026-09-28',
    orderBy: '-lastSeenAt',
    pageSize: '20',
    createdAfter: '2026-01-01',
    createdBefore: '2026-09-28',
  });
  await page.goto('/users/alice');
  await expect(
    page.getByRole('heading', { name: 'Alice', exact: true }),
  ).toBeVisible();
});
