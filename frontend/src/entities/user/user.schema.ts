import { z } from 'zod';

export const userUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'O nome de usuário precisa de pelo menos 3 caracteres.')
    .max(50, 'O nome de usuário é limitado a 50 caracteres.')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Use letras, números, pontos, hífens ou sublinhados.',
    ),
  name: z
    .string()
    .trim()
    .max(100, 'O nome de exibição é limitado a 100 caracteres.')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'A bio é limitada a 1000 caracteres.')
    .optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const usernameParamSchema = z.string().trim().min(3).max(50);
