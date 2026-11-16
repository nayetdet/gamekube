# 🎮 GameKube

**GameKube** é uma plataforma cloud-native de jogos sob demanda e rede social gamer orquestrada sobre **Kubernetes**. Cada sessão de jogo é provisionada dinamicamente em containers isolados no cluster, com persistência de saves em armazenamento de objetos (**MinIO / S3**), autenticação centralizada via **Keycloak (OIDC + PKCE)** e comunicação social em tempo real (**WebSocket / STOMP**).

---

## Principais Funcionalidades

- **Autenticação e Identidade Centralizada (OIDC):** Login seguro via Keycloak com fluxo Authorization Code + PKCE, sessão criptografada em cookies HTTP-only e proteção das instâncias de jogos com `oauth2-proxy`.
- **Orquestração Dinâmica de Jogos no Kubernetes:** Provisionamento sob demanda de pods dedicados por jogador, verificação de atividade (*heartbeat*) e encerramento automático de instâncias ociosas.
- **Persistência e Gestão de Saves (`.zip`):** Sincronização automática do progresso no MinIO/S3 ao encerrar a partida, permitindo baixar o backup (`.zip`) ou redefinir o save pela interface web.
- **Perfil do Jogador e Avatar Customizado:** Edição de dados públicos, upload de foto de perfil armazenada no S3 (`JPEG`, `PNG`, `GIF`, `WebP`), histórico de jogos e configurações de conta/privacidade.
- **Rede Social e Presença em Tempo Real:** Diretório de jogadores com filtros avançados, gerenciamento de amizades (solicitar, aceitar, recusar, remover), status ao vivo (`Online`, `Offline`, `Jogando...`) e chat direto 1:1 via STOMP/WebSocket + Server-Sent Events (SSE).

---

## Arquitetura do Projeto

![Arquitetura Lógica do GameKube](docs/images/arquitetura-logica-gamekub.jpeg)

```text
gamekube/
├── infra/               # Cluster Kind, charts Helm (Keycloak, PostgreSQL, Redis, MinIO, Ingress, Cert-Manager)
├── backend/             # API REST & WebSocket em Java 21 + Spring Boot, Flyway, Fabric8 K8s Client e AWS S3 SDK
├── frontend/            # Aplicação Web em Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 e Playwright
└── docs/requirements/   # Especificação de Requisitos de Software (SRS) em HTML e gerador de PDF
```

---

## Como Executar Localmente

### Pré-requisitos
- **Docker**, **Kind** e **Helm** (para o cluster Kubernetes local)
- **Java 21** (para o backend Spring Boot)
- **Bun 1.3+** ou **Node.js 22+** (para o frontend Next.js)

### 1. Subir a Infraestrutura (Cluster Kubernetes)
```bash
make -C infra up
```

### 2. Iniciar o Backend (`:8000`)
```bash
cp backend/.env.example backend/.env
make -C backend up
```

### 3. Iniciar o Frontend (`:3000`)
```bash
cd frontend
cp .env.example .env.local
npm run dev   # ou: bun run dev
```

Acesse a aplicação em **http://localhost:3000**.

---

## Qualidade e Testes

```bash
# Verificar formatação (Prettier / Spotless), linter (ESLint) e testes unitários
make check

# Executar suíte de testes E2E no navegador (Playwright)
cd frontend && npm run test:e2e
```

---

## Documentação de Engenharia de Software

- **Especificação de Requisitos de Software (SRS):** [`docs/requirements/Documento_de_Requisitos_GameKube.pdf`](docs/requirements/Documento_de_Requisitos_GameKube.pdf)
- **Documentação do Cliente Web:** [`frontend/README.md`](frontend/README.md)
