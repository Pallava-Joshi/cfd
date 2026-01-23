# Stage 1: Base (Shared by builder and runner)
FROM node:22.18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@9
WORKDIR /app

FROM base AS builder
RUN pnpm add -g turbo@2
COPY . .

RUN pnpm install --frozen-lockfile

RUN cd packages/prisma && DATABASE_URL="postgresql://dummy:5432" pnpm prisma generate

RUN turbo run build --filter=api-service

RUN pnpm --filter=api-service --prod deploy /app/deployed

FROM base AS runner
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /app/deployed /app

WORKDIR /app
EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]