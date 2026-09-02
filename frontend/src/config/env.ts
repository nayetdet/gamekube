import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  APP_URL: z.url(),
  BACKEND_API_URL: z.url(),
  KEYCLOAK_ISSUER_URL: z.url(),
  KEYCLOAK_CLIENT_ID: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  GAME_SESSION_DOMAIN: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse({
    APP_URL: process.env.APP_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    KEYCLOAK_ISSUER_URL: process.env.KEYCLOAK_ISSUER_URL,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GAME_SESSION_DOMAIN: process.env.GAME_SESSION_DOMAIN,
  });

  if (!parsed.success) {
    const missing = Object.keys(z.flattenError(parsed.error).fieldErrors);
    throw new Error(`Invalid environment variables: ${missing.join(', ')}`);
  }

  cached = parsed.data;
  return cached;
}
