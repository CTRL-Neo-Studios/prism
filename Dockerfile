# syntax=docker/dockerfile:1.6

# 1) Dependencies (with toolchain for native addons)
FROM node:22-slim AS deps
WORKDIR /app

# Install build tools for node-gyp/native modules (better-sqlite3, sharp, etc.)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy lockfiles for cached installs
COPY package.json package-lock.json ./
# Deterministic + faster installs in CI
RUN npm ci --prefer-offline

# 2) Build
FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 3) Runner (minimal runtime image)
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only the built Nitro output
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
