# ============================================================
# Dockerfile — apps/web (Next.js)
# Multi-stage build: stage "build" gera o .next, stage "prod" roda
# ============================================================

# ---- Stage 1: dependências + build ----
FROM node:22-alpine AS build
WORKDIR /app

# Copia os manifests do monorepo (raiz + workspaces)
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

# Instala TODAS as dependências (workspaces)
RUN npm ci

# Copia o código-fonte do shared e compila (o web importa o dist)
COPY packages/shared packages/shared
RUN npm run build -w @eco-libras/shared

# Copia o código do web e compila o Next
COPY apps/web apps/web
RUN npm run build -w apps/web

# ---- Stage 2: produção (enxuto) ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# Instala só as dependências de produção
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --omit=dev

# Reusa o .next e o shared compilados
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/web/.next apps/web/.next
COPY --from=build /app/apps/web/public apps/web/public
COPY --from=build /app/apps/web/package.json apps/web/package.json

# O Next.js em produção precisa do node_modules do web com os binários
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "run", "start"]
