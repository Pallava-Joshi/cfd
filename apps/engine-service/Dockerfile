FROM node:22.18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9 turbo@2

# Prune stage
FROM base AS pruner
COPY . .
RUN turbo prune engine-service --docker

# Builder stage: install deps, generate Prisma, build
FROM base AS builder
# Compat libs for Prisma engine on Alpine
RUN apk add --no-cache libc6-compat openssl

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# Generate Prisma using the package that has the CLI; run from root so output lands in pnpm store
WORKDIR /app
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" \
    pnpm --filter @repo/prisma exec prisma generate --schema=prisma/schema.prisma

RUN pnpm turbo run build --filter=engine-service...

# Runner stage: minimal prod image
FROM node:22.18-alpine AS runner
# Runtime compat lib (openssl for engine)
RUN apk add --no-cache openssl

WORKDIR /app

# Non-root user
RUN addgroup -S nodejs -g 1001 && \
    adduser -S engineuser -u 1001 -G nodejs

# Copy ENTIRE built app from builder (includes all node_modules + generated Prisma files)
COPY --from=builder --chown=engineuser:nodejs /app .

USER engineuser

ENV NODE_ENV=production
ENV PORT=3002

WORKDIR /app/apps/engine-service
EXPOSE 3002
CMD ["node", "dist/index.js"]