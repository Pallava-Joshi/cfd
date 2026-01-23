FROM node:22.18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

FROM base AS prepare
COPY . .
RUN turbo prune web --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ .
WORKDIR /app/apps/web
RUN pnpm build

FROM base AS runner
WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]