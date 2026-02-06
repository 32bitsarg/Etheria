# Multi-stage Dockerfile for Etheria Monorepo
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root manifest and workspace manifests
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/core/package.json ./packages/core/package.json
COPY packages/races/package.json ./packages/races/package.json
COPY packages/data/package.json ./packages/data/package.json
COPY packages/buildings/package.json ./packages/buildings/package.json
COPY packages/character/package.json ./packages/character/package.json
COPY packages/classes/package.json ./packages/classes/package.json
COPY packages/combat/package.json ./packages/combat/package.json
COPY packages/game-engine/package.json ./packages/game-engine/package.json
COPY packages/resources/package.json ./packages/resources/package.json

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
WORKDIR /app/apps/web
RUN npx prisma generate

# Build all workspace packages (dependencies)
WORKDIR /app
RUN npm run build -w packages/core \
    -w packages/races \
    -w packages/data \
    -w packages/game-engine \
    -w packages/combat \
    -w packages/buildings \
    -w packages/character \
    -w packages/classes \
    -w packages/resources

# Build the Next.js app
WORKDIR /app/apps/web
# We need environment variables at build time for Next.js 
# These will be passed via build-args in GitHub Actions
ARG DATABASE_URL
ARG JWT_SECRET
ARG NEXT_PUBLIC_APPWRITE_ENDPOINT
ARG NEXT_PUBLIC_APPWRITE_PROJECT_ID
ARG NEXT_PUBLIC_APPWRITE_DATABASE_ID
ARG NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID

ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV NEXT_PUBLIC_APPWRITE_ENDPOINT=$NEXT_PUBLIC_APPWRITE_ENDPOINT
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID=$NEXT_PUBLIC_APPWRITE_PROJECT_ID
ENV NEXT_PUBLIC_APPWRITE_DATABASE_ID=$NEXT_PUBLIC_APPWRITE_DATABASE_ID
ENV NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID=$NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Prisma needs the schema file in some cases even in production
COPY --from=builder /app/apps/web/prisma ./apps/web/prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# Note: server.js is created by next build from the standalone output
# But since it's a monorepo, it might be in apps/web/server.js
CMD ["node", "apps/web/server.js"]
