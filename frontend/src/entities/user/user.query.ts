import { z } from 'zod';

export const userSortFields = [
  'id',
  'username',
  'name',
  'createdAt',
  'updatedAt',
] as const;

export type UserSortField = (typeof userSortFields)[number];

export const userPageSizes = [10, 20, 50] as const;

export const defaultUserQuery = {
  pageNumber: 0,
  pageSize: 10,
  orderBy: 'username',
} as const;

export const userQuerySchema = z.object({
  pageNumber: z.coerce.number().int().min(0).catch(defaultUserQuery.pageNumber),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .catch(defaultUserQuery.pageSize),
  orderBy: z.string().catch(defaultUserQuery.orderBy),
  username: z.string().trim().min(1).optional().catch(undefined),
  name: z.string().trim().min(1).optional().catch(undefined),
  createdAfter: z.iso.date().optional().catch(undefined),
  createdBefore: z.iso.date().optional().catch(undefined),
});

export type UserQuery = z.infer<typeof userQuerySchema>;
