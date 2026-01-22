FROM node:22.18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

FROM base AS prepare
COPY . .
RUN turbo prune web --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
RUN pnpm install --no-frozen-lockfile
COPY --from=prepare /app/out/full/ .
WORKDIR /app/apps/web
RUN pnpm build

# Deploy stage: create standalone folder with resolved prod deps
FROM base AS deployer
COPY --from=builder /app /app-full
WORKDIR /app-full
# Important: run from root + --filter to select the web package
RUN pnpm deploy --filter=web --prod /app-deploy

FROM base AS runner
WORKDIR /app
COPY --from=deployer /app-deploy ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]