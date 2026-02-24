# 1️⃣ Base image
FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm
RUN corepack enable

# 2️⃣ Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 3️⃣ Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build Next.js
RUN pnpm build

# 4️⃣ Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app ./

USER appuser

EXPOSE 3000

# Run migrations then start app
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]