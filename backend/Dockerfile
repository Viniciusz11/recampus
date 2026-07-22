# syntax=docker/dockerfile:1

# --- deps: instala TODAS as dependências (dev incluído - precisa do prisma
# CLI e do typescript pra gerar o client e compilar na próxima stage) ---
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- build: gera o Prisma Client e compila TypeScript -> dist/ ---
FROM node:22-slim AS build
WORKDIR /app
# O engine do Prisma é dinamicamente linkado contra OpenSSL - a imagem slim
# não traz isso por padrão.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- prod-deps: só as dependências de runtime (sem prisma CLI, sem typescript) ---
FROM node:22-slim AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- runtime: imagem final - só o necessário pra rodar `node dist/server.js` ---
FROM node:22-slim AS runtime
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash appuser

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
# @prisma/client fica em node_modules/@prisma/client, mas o código GERADO
# (query engine + tipos) vai pra node_modules/.prisma - o prod-deps não tem
# isso porque `prisma generate` só rodou na stage de build.
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/dist ./dist
# prisma/schema.prisma e as migrations NÃO vão pra esta imagem: o client já
# gerado acima é tudo que `node dist/server.js` precisa em runtime. Migração
# é rodada à parte (ver README) contra o mesmo DATABASE_URL, não daqui de dentro.

USER appuser
EXPOSE 3333

CMD ["node", "dist/server.js"]
