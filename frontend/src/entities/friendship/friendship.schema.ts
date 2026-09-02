import { z } from 'zod';

export const friendRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'O nome de usuário precisa de pelo menos 3 caracteres.')
    .max(50, 'O nome de usuário é limitado a 50 caracteres.'),
});

export type FriendRequestInput = z.infer<typeof friendRequestSchema>;

export const friendshipIdSchema = z.uuid('Pedido de amizade desconhecido.');
