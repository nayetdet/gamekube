import { z } from 'zod';
import { presenceStatuses } from './presence.entity';

export const presenceUpdateSchema = z.object({
  status: z.enum(presenceStatuses),
  currentGame: z
    .string()
    .trim()
    .max(100, 'Mantenha o nome do jogo com menos de 100 caracteres.')
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type PresenceUpdateInput = z.infer<typeof presenceUpdateSchema>;
