# ReCampus

Marketplace de economia circular para a comunidade universitária: um lugar para doar, vender e
encontrar livros, calculadoras, jalecos, componentes eletrônicos e outros materiais de estudo
entre estudantes do mesmo campus — em vez de deixar tudo parado numa gaveta depois que o
semestre acaba.

Projeto desenvolvido para o desafio técnico do processo seletivo de estágio Full-Stack do
**Laboratório de Inovação Vortex (UNIFOR)**, 2026.

> **Diário de Bordo da IA** está na [última seção deste README](#diário-de-bordo-da-ia).


## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar localmente](#como-rodar-localmente)
- [Rodando com Docker](#rodando-com-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Melhorias futuras](#melhorias-futuras)
- [Diário de Bordo da IA](#diário-de-bordo-da-ia)

---

## Sobre o projeto

Calouros gastam caro comprando material novo; veteranos formandos têm livros, calculadoras e
jalecos parados sem uso. O ReCampus conecta as duas pontas: qualquer estudante autenticado pode
anunciar um item para **doação ou venda**, e qualquer visitante pode navegar pela vitrine pública
filtrando por categoria antes mesmo de criar conta.

O projeto é uma aplicação única com duas metades:

- **Landing Page** (desktop): apresentação da proposta, estatísticas, vitrine pública com os
  últimos anúncios e CTA para cadastro.
- **Aplicação instalável (PWA)**: em telas menores (ou instalada via "Adicionar à tela inicial"),
  a mesma aplicação vira uma experiência de app — bottom navigation, botão flutuante para
  anunciar, e funciona parcialmente offline.

## Arquitetura

Monorepo simples — `backend/` e `frontend/` são dois projetos Node independentes na mesma raiz
Git, sem workspaces (cada plataforma de deploy — Render e Vercel — builda um de cada vez, então
workspaces só adicionariam complexidade de resolução de dependências sem benefício real aqui).

**Backend** — arquitetura em camadas com Repository Pattern:

```
routes → controllers → services → repositories → Prisma
              ↓             ↓
         schemas (zod)  interfaces de repositório
```

`services` dependem de **interfaces** de repositório (`UserRepository`, `AdRepository`...), não
das implementações concretas em Prisma — a injeção da implementação real acontece só em
`container.ts` (a raiz de composição). Isso é uma versão pragmática do Clean Architecture:
aplica a Regra de Dependência onde ela importa (testabilidade, troca de implementação) sem a
burocracia de use-cases individuais, que não se justifica para um domínio de 2 entidades
(`User`, `Ad`).

**Frontend** — Landing e App Shell são a **mesma árvore de rotas**, não dois aplicativos
separados: `AppShellLayout` alterna entre bottom-navigation (mobile) e navegação horizontal
(desktop) via classes responsivas do Tailwind, reaproveitando os mesmos componentes de listagem
de anúncios em ambos os contextos.

```
React Query (estado de servidor) + Context API (sessão/tema, estado pequeno e global)
```

Sem Redux: React Query cobre cache/loading/erro de dados remotos, Context cobre o resto — uma
lib de estado global adicional seria redundante para o tamanho deste projeto.

## Tecnologias

**Backend**

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js 22+, TypeScript |
| Framework HTTP | Express 5 |
| ORM / Banco | Prisma ORM + PostgreSQL |
| Autenticação | JWT (access token) + refresh token rotativo em cookie httpOnly, bcrypt |
| Upload de imagem | Multer (multipart/form-data) + Supabase Storage |
| Validação | Zod |
| Segurança | Helmet, CORS, express-rate-limit |
| Qualidade | ESLint 10 (flat config) + regras do React Compiler, Prettier, TypeScript strict |

**Frontend**

| Categoria | Tecnologia |
|---|---|
| Framework | React 19 + Vite 8 + TypeScript |
| Roteamento | React Router 7 |
| Estado de servidor | TanStack Query (React Query) |
| Formulários | React Hook Form + Zod (`@hookform/resolvers`) |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first) |
| Animações | Framer Motion |
| Ícones | lucide-react |
| PWA | vite-plugin-pwa (Workbox) |
| Notificações | Sonner (toasts) |
| HTTP | Axios (com interceptor de refresh automático) |

**Infraestrutura**

| Categoria | Tecnologia |
|---|---|
| Container | Docker + Docker Compose (backend + Postgres) |
| Deploy backend | Render |
| Deploy frontend | Vercel |
| Banco em produção | Supabase PostgreSQL |
| Storage de imagens | Supabase Storage (bucket público `ad-images`) |

## Estrutura de pastas

```
Vortex/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma       # User, Ad, RefreshToken + enums
│   │   ├── migrations/
│   │   └── seed.ts             # 2 usuários + 10 anúncios de exemplo
│   └── src/
│       ├── app.ts              # fábrica da app Express (middlewares globais)
│       ├── server.ts           # bootstrap (app.listen)
│       ├── container.ts        # raiz de composição (DI manual)
│       ├── config/              # env validado com zod, singleton do Prisma Client
│       ├── routes/              # mapeamento método+path -> controller
│       ├── controllers/         # parse de req/res, sem lógica de negócio
│       ├── services/            # regras de negócio (ex: AdService valida preço x tipo)
│       ├── repositories/        # única camada que conhece o Prisma
│       ├── middlewares/         # authGuard, validate, errorHandler, notFoundHandler
│       ├── schemas/              # validação Zod por endpoint
│       ├── types/                # tipos compartilhados + augmentation do Express
│       └── utils/                # AppError, jwt, hash, paginação, serializers
└── frontend/
    └── src/
        ├── App.tsx               # providers (Query/Theme/Auth/Router) + PWA update
        ├── routes/               # AppRouter, ProtectedRoute
        ├── layouts/              # PublicLayout, AppShellLayout (bottom-nav + FAB)
        ├── pages/                # uma página por rota
        ├── components/
        │   ├── landing/          # Navbar, Hero, Stats, Benefits, HowItWorks...
        │   ├── ads/               # AdCard, AdGrid, AdForm, AdFiltersBar...
        │   ├── auth/              # LoginForm, RegisterForm
        │   └── common/            # Button, Input, Modal, Toaster, Skeleton...
        ├── contexts/              # AuthContext/Provider, ThemeContext/Provider
        ├── hooks/                 # useAuth, useTheme, useAds, useAdMutations...
        ├── services/              # api.ts (axios+interceptor), auth/ads services
        ├── types/                  # Ad, User, PaginatedResult
        └── utils/                  # cn, format (preço/data pt-BR), errors, adMeta
```

## Como rodar localmente

### Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- PostgreSQL 14+ rodando localmente (ou use o [Docker Compose](#rodando-com-docker) para não
  precisar instalar nada além do Docker)

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd Vortex
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# edite o .env: no mínimo DATABASE_URL apontando pro seu Postgres,
# JWT_SECRET e REFRESH_TOKEN_SECRET com valores diferentes um do outro

npm install

# aplica a migration existente (não cria uma nova - schema já está pronto)
npx prisma migrate deploy

# opcional, mas recomendado: popula 2 usuários e 10 anúncios de exemplo
npm run prisma:seed

npm run dev
```

A API sobe em `http://localhost:3333`. Teste com `curl http://localhost:3333/api/v1/health`.

Login de teste após o seed: `ana@recampus.dev` ou `bruno@recampus.dev`, senha `senha123`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
# VITE_API_URL já vem correto pro backend local (http://localhost:3333/api/v1)

npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Atalho: subir os dois juntos

Há um `package.json` na raiz com um script de conveniência (usa `concurrently`):

```bash
npm run install:all   # instala backend e frontend
npm run dev            # sobe os dois ao mesmo tempo
```

## Rodando com Docker

O `docker-compose.yml` sobe **Postgres + backend**. O frontend não é containerizado — é uma SPA
estática (build do Vite), então roda direto com `npm run dev` ou é servida por um CDN em
produção.

```bash
# sobe só o Postgres primeiro
docker compose up -d postgres

# migração roda do host, contra o Postgres do compose (porta 5432 exposta)
cd backend
cp .env.example .env
# DATABASE_URL="postgresql://recampus:recampus@localhost:5432/recampus?schema=public"
npm install
npx prisma migrate deploy
npm run prisma:seed

# agora sim, sobe o backend containerizado
cd ..
docker compose up -d --build backend
```

> Migração **não** roda automaticamente no boot do container de propósito: se o backend algum
> dia escalar para várias réplicas, todas migrando ao mesmo tempo no start seria uma corrida de
> schema. Fica como um passo de deploy explícito.

## Variáveis de ambiente

**Backend** (`backend/.env`, veja `backend/.env.example`)

| Variável | Descrição |
|---|---|
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | Porta da API (padrão `3333`) |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | Segredo do access token (gere com `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | Validade do access token (padrão `15m`) |
| `REFRESH_TOKEN_SECRET` | Segredo do refresh token — **diferente** do `JWT_SECRET` |
| `REFRESH_TOKEN_EXPIRES_IN` | Validade do refresh token (padrão `7d`) |
| `CORS_ORIGIN` | Origem exata autorizada a fazer requisições com cookies |
| `SUPABASE_URL` | URL do projeto Supabase (`https://<ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave `service_role` do Supabase — server-only, nunca no frontend |
| `SUPABASE_STORAGE_BUCKET` | Bucket público de imagens dos anúncios (padrão `ad-images`) |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Janela e limite do rate limit global |
| `AUTH_RATE_LIMIT_MAX` | Limite específico pras rotas de autenticação |

**Frontend** (`frontend/.env`, veja `frontend/.env.example`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API, sem barra final (ex: `http://localhost:3333/api/v1`) |

## Scripts disponíveis

**Backend** (`cd backend`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API com reload automático (tsx watch) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a build compilada (`node dist/server.js`) |
| `npm run lint` | ESLint |
| `npm run prisma:migrate` | Cria e aplica uma nova migration (dev) |
| `npm run prisma:deploy` | Aplica migrations existentes sem criar novas (deploy) |
| `npm run prisma:seed` | Popula o banco com dados de exemplo |
| `npm run prisma:studio` | Abre o Prisma Studio (GUI do banco) |

**Frontend** (`cd frontend`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o Vite dev server |
| `npm run build` | Typecheck + build de produção (`dist/`) |
| `npm run preview` | Serve a build de produção localmente |
| `npm run lint` | ESLint |

## Deploy

Aplicação em produção:

- **Frontend**: https://recampus-seven.vercel.app
- **Backend (health check)**: https://recampus-api.onrender.com/health
- **Repositório**: https://github.com/Viniciusz11/recampus

Login de teste: `ana@recampus.dev` ou `bruno@recampus.dev`, senha `senha123`.

Stack de deploy:

- **Backend → [Render](https://render.com)**: Web Service via `render.yaml` (Blueprint), build
  usando o `Dockerfile` multi-stage de `backend/`. Segredos (`DATABASE_URL`, `DIRECT_URL`,
  `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `CORS_ORIGIN`) preenchidos manualmente no dashboard, nunca
  commitados (`sync: false` no blueprint).
- **Frontend → [Vercel](https://vercel.com)**: root directory `frontend/`, framework preset Vite,
  variável `VITE_API_URL` apontando pra URL pública do backend no Render. Um `vercel.json` com
  rewrite de SPA (`/(.*) → /index.html`) é necessário — sem ele, qualquer rota do React Router
  que não seja a raiz retorna 404 em acesso direto ou F5.
- **Banco → [Supabase](https://supabase.com)** PostgreSQL: connection pooler em modo *transaction*
  (`DATABASE_URL`, porta 6543, `?pgbouncer=true`) para o runtime da aplicação, e conexão direta em
  modo *session* (`DIRECT_URL`, porta 5432) para o Prisma rodar migrations — o modo transaction não
  suporta os prepared statements que as migrations exigem.

## Melhorias futuras

- Testes automatizados (unitários em `services` com repositórios fake — a arquitetura já foi
  desenhada pensando nisso — e testes e2e nas rotas).
- Busca full-text real (`pg_trgm` + índice GIN) em vez de `ILIKE` simples, se o volume de
  anúncios crescer.
- Soft delete em vez de exclusão física, se histórico de anúncios remove for necessário.
- CI (lint + typecheck + build a cada push).
- Chat ou campo de contato entre comprador e anunciante.

## Diário de Bordo da IA

### Ferramentas utilizadas

**Claude Code** (Claude Sonnet 5), rodando em modo agente diretamente no ambiente de
desenvolvimento — não um chat separado onde eu colava trechos de código, mas um assistente com
acesso direto ao terminal, ao sistema de arquivos e a um navegador headless (Playwright) pra
testar o que ia sendo construído.

### Estratégia de engenharia de prompts

Em vez de ir pedindo funcionalidade por funcionalidade, escrevi **um prompt de arquitetura único
e detalhado** no início, definindo papel (engenheiro staff), stack completa, restrições
explícitas ("não simplifique a arquitetura", "sem arquivos gigantes", "sem código duplicado",
SOLID) e — o mais importante — uma **ordem de execução obrigatória** com um portão de aprovação
entre cada etapa. Isso trocou "gerar tudo de uma vez e torcer" por um processo onde eu revisava
e aprovava cada decisão antes da próxima etapa começar.

**Prompt 1 — o brief de arquitetura** (trecho real, é o prompt que abre este projeto):

> Você é um Engenheiro de Software Staff (Google/Stripe/Microsoft) especialista em arquitetura
> Full Stack [...] Seu objetivo NÃO é apenas escrever código. Você deve agir como um mentor
> técnico experiente, tomando decisões de arquitetura profissionais e explicando cada uma
> delas. [...] NÃO escreva tudo de uma vez. Trabalhe como um desenvolvedor real. Sempre siga
> esta ordem: 1 Arquitetura, 2 Estrutura de pastas, 3 Banco, 4 Backend [...] Ao terminar cada
> etapa: explique todas as decisões tomadas; mostre possíveis melhorias; aguarde minha
> confirmação antes de continuar.

**Prompt 2 — depurando o cache offline do PWA** (representativo da sessão de debugging real da
Etapa 7): pedi para investigar por que, mesmo com o Service Worker ativo e controlando a
página, o cache de `/api/v1/ads` continuava vazio depois de visitar a vitrine — e para não
assumir que era bug de aplicação sem antes checar `navigator.serviceWorker.controller` e o
conteúdo real do `Cache Storage` via `caches.open(...).keys()`.

**Prompt 3 — logout com destino inconsistente**: pedi para investigar por que clicar em "Sair"
às vezes deixava o usuário na landing page e às vezes na tela de login, mesmo com o código
sempre executando na mesma ordem — e para instrumentar a renderização com `console.log` em vez
de só reordenar código e torcer, já que a primeira tentativa de correção (reordenar
`navigate()`) não resolveu.

### Compartilhamento de histórico

Como o desenvolvimento aconteceu via Claude Code (agente de CLI/IDE) e não num chat do tipo
claude.ai, não existe um link de conversa público equivalente pra compartilhar aqui. O
equivalente mais fiel é o **histórico de commits deste repositório** (`git log`): cada commit
documenta o que foi feito, por quê, e — nos casos relevantes — qual bug real apareceu durante o
teste e como foi corrigido. É um registro cronológico real do processo, só que em formato de
commit em vez de mensagem de chat.

### Reflexão crítica

O momento mais revelador não foi um erro óbvio — foi um **bug que passou por typecheck, lint e
build de produção sem nenhum aviso**, e só apareceu ao testar num navegador de verdade.

Depois de terminar as telas do frontend (Etapa 5), pedi pra verificar tudo rodando de fato num
navegador, não só confiar nas ferramentas estáticas. Ao abrir a página de anúncios, a aplicação
quebrava com `TypeError: Cannot read properties of undefined (reading 'totalPages')` — um erro
que, à primeira vista, parecia que o backend não tinha devolvido a resposta esperada. Investigando
mais a fundo: sem o arquivo `.env` do frontend configurado, o Axios tratava as chamadas de API
como **caminhos relativos ao próprio Vite dev server** (não ao backend). O Vite, por sua vez,
devolve o `index.html` (fallback de SPA) pra qualquer rota que não reconhece — então a "resposta
da API" era, na real, uma página HTML inteira sendo tratada como se fosse o JSON esperado.

Identifiquei o problema não adivinhando, mas isolando a causa: rastreei a resposta de rede real
(`curl`/inspeção da resposta), percebi que o `Content-Type` batia com HTML, e a partir daí ficou
claro que a variável de ambiente estava ausente. A correção não foi só "criar o `.env`" — decidi
também que o **código deveria se comportar de forma defensiva** mesmo num cenário de
configuração errada, então tratei isso como dois problemas: (1) o ambiente de teste precisava do
`.env` de fato, e (2) mais adiante, ao revisar `getErrorMessage`, percebi que erros de servidor
(500) também estavam sendo mostrados crus pro usuário — a mesma classe de problema (confiar
demais numa resposta "bem-comportada" da rede), então resolvi as duas coisas juntas.

Esse episódio mudou como conduzi o resto do desenvolvimento: depois dele, toda entrega de UI
passou a ser testada com um navegador real (Playwright headless) antes de ser considerada
pronta — não só typecheck/lint/build — porque ficou claro que esses três não pegam bugs que só
existem na fronteira entre o código e o ambiente de execução real.

---

**Autor:** Vinícius Andrade
**Contato:** viniciusandradeevangelista2003@gmail.com
