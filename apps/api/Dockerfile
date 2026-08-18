# ============================================================
# Dockerfile — apps/api (NestJS)
# Multi-stage build: stage "build" compila, stage "prod" é enxuto
# ============================================================

# ---- Stage 1: dependências + build ----
FROM node:22-alpine AS build
WORKDIR /app

# Copia os manifests do monorepo (raiz + workspaces)
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

# Instala TODAS as dependências (workspaces)
RUN npm ci

# Copia o código-fonte do shared e compila (gera o dist que a API consome)
COPY packages/shared packages/shared
RUN npm run build -w @eco-libras/shared

# Copia o código da API e compila
COPY apps/api apps/api
RUN npm run build -w apps/api

# ---- Stage 2: produção (enxuto) ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# Instala só as dependências de produção dos workspaces
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --omit=dev

# Reusa os dists compilados no stage de build
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/api/dist apps/api/dist

# Expõe a porta da API
EXPOSE 3000

# Roda o app compilado
CMD ["node", "apps/api/dist/main.js"]
