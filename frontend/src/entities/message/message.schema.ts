import { z } from 'zod';
import { usernameParamSchema } from '@/entities/user/user.schema';

export const messageRequestSchema = z.object({
  username: usernameParamSchema,
  content: z
    .string()
    .trim()
    .min(1, 'Escreva uma mensagem.')
    .max(2000, 'A mensagem é limitada a 2000 caracteres.'),
});

export const conversationQuerySchema = z.object({
  page: z.coerce.number().int().min(0).catch(0),
});

export const messageNotificationSchema = z.object({
  senderUsername: z.string(),
  recipientUsername: z.string(),
});

export const readNotificationSchema = z.object({ readerUsername: z.string() });
