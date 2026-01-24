FROM node:22.18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9 turbo@2

FROM base AS prepare
COPY . .
RUN turbo prune price-poller-service --docker


FROM base AS builder
WORKDIR /app

COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ .

# Build the service (Triple dots include local workspace deps like @repo/redis)
RUN pnpm turbo run build --filter=price-poller-service...


FROM base AS runner
WORKDIR /app

# Minimal workspace metadata
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .

# Copy packages (excluding Prisma since we don't need it)
COPY --from=builder /app/packages ./packages

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

# Copy built app files
COPY --from=builder /app/apps/price-poller-service/dist ./apps/price-poller-service/dist
COPY --from=builder /app/apps/price-poller-service/package.json ./apps/price-poller-service/package.json

# Non-root user
RUN addgroup -S nodejs -g 1001 && \
    adduser -S polleruser -u 1001 -G nodejs && \
    chown -R polleruser:nodejs /app

USER polleruser

ENV NODE_ENV=production
ENV PORT=3003

WORKDIR /app/apps/price-poller-service
EXPOSE 3003

CMD ["node", "dist/index.js"]