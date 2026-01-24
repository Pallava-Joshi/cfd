FROM node:22.18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9 turbo@2

FROM base AS prepare
COPY . .
RUN turbo prune engine-service --docker

FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ .

# Generate Prisma client
WORKDIR /app/packages/prisma
RUN npm install -g prisma@6.15.0
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" \
    prisma generate --schema=prisma/schema.prisma

# Build engine-service 
WORKDIR /app
RUN pnpm turbo run build --filter=engine-service...

FROM base AS runner
WORKDIR /app
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml .
COPY --from=builder /app/packages ./packages
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/packages/prisma/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/apps/engine-service/dist ./apps/engine-service/dist
COPY --from=builder /app/apps/engine-service/package.json ./apps/engine-service/package.json

RUN addgroup -S nodejs -g 1001 && adduser -S engineuser -u 1001 -G nodejs
USER engineuser

ENV NODE_ENV=production
ENV PORT=3002
WORKDIR /app/apps/engine-service
EXPOSE 3002
CMD ["node", "dist/index.js"]