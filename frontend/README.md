# GameKube — web client

Next.js 16 (App Router) front end for the GameKube API. It signs players in
through Keycloak, keeps the session server-side, and consumes every endpoint
the Spring Boot backend exposes.

## Requirements

- [Bun](https://bun.sh) 1.3+
- The backend running on `:8081` and Keycloak on `:8080`
  (`docker compose up` from the repository root starts both)

## Getting started

```bash
cp .env.example .env.local          # then set SESSION_SECRET
openssl rand -base64 32             # a value for SESSION_SECRET
bun install
bun run dev
```

The app is served on <http://localhost:3000>, which is the redirect URI the
`frontend-client` public client is registered with in the realm import.

| Variable              | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `APP_URL`             | Public origin; used for redirect URIs and cookie flags |
| `BACKEND_API_URL`     | Base URL of the GameKube API                           |
| `KEYCLOAK_ISSUER_URL` | Realm issuer, e.g. `.../realms/gamekube`               |
| `KEYCLOAK_CLIENT_ID`  | Public OIDC client (`frontend-client`)                 |
| `SESSION_SECRET`      | ≥32 bytes; encrypts the session cookies                |

## Scripts

| Command          | What it does                            |
| ---------------- | --------------------------------------- |
| `bun run dev`    | Development server                      |
| `bun run build`  | Production build                        |
| `bun run start`  | Serve the production build              |
| `bun run format` | Prettier, in place                      |
| `bun run check`  | Prettier check + ESLint (zero warnings) |

## Architecture

See [`docs/architecture.md`](./docs/architecture.md) for the layering rules,
the authentication flow and the endpoint-to-screen map.
