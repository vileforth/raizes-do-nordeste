FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"
RUN pnpm --filter @raizes/shared build
RUN pnpm --filter @raizes/api build
RUN pnpm deploy --filter @raizes/api --prod /prod/api
RUN cp -r /app/apps/api/dist /prod/api/dist
RUN mkdir -p /prod/api/node_modules/@raizes/shared
RUN cp -r /app/packages/shared/dist /prod/api/node_modules/@raizes/shared/dist
RUN cp /app/packages/shared/package.json /prod/api/node_modules/@raizes/shared/package.json

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /prod/api ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
