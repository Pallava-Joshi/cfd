FROM node:22.18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@9 turbo@2
WORKDIR /app

#Prune (Keep only API-related files)
FROM base AS pruner
COPY . .
RUN turbo prune api-service --docker

#Builder (Compile TS and Generate Prisma)
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client (with default output path)
RUN cd packages/prisma && \
    DATABASE_URL="postgresql://dummy:5432" npx prisma generate

# Build the API and all dependencies
RUN turbo run build --filter=api-service...

#Runner (Production image)
FROM node:22.18-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

# Non-root user
RUN addgroup -S nodejs -g 1001 && adduser -S nodejs -u 1001 -G nodejs
USER nodejs
# This preserves the .prisma/client in its correct nested location
COPY --from=builder --chown=nodejs:nodejs /app .

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/api-service/dist/index.js"]