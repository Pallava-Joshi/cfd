# =========================
# Base stage
# =========================
FROM node:22.18-alpine AS base

WORKDIR /app

RUN npm install -g pnpm@9 turbo@2


# =========================
# Prepare stage
# =========================
FROM base AS prepare

COPY . .
RUN turbo prune api-service --docker


# =========================
# Builder stage
# =========================
FROM base AS builder

WORKDIR /app

# Install deps needed for build
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copy full source
COPY --from=prepare /app/out/full/ .

# Generate Prisma client
WORKDIR /app/packages/prisma
RUN npm install -g prisma@6.15.0
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" \
    prisma generate --schema=prisma/schema.prisma

# Build api-service
WORKDIR /app
RUN pnpm turbo run build --filter=api-service^... --concurrency=16


# =========================
# Runner stage (production)
# =========================
FROM base AS runner

WORKDIR /app

# Minimal workspace metadata
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .

# Copy packages (including prisma package)
COPY --from=builder /app/packages ./packages

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

# Copy generated Prisma client
COPY --from=builder /app/packages/prisma/node_modules/@prisma ./node_modules/@prisma

# Copy built API
COPY --from=builder /app/apps/api-service/dist ./apps/api-service/dist
COPY --from=builder /app/apps/api-service/package.json ./apps/api-service/package.json

# Non-root user
RUN addgroup -S nodejs -g 1001 && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app/apps/api-service
EXPOSE 3001

CMD ["node", "dist/index.js"]
