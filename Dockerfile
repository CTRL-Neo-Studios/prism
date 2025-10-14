# syntax=docker/dockerfile:1.6

FROM node:22-slim AS deps
WORKDIR /app

# Install build essentials for native addons
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy lockfile(s) and install
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build your Nuxt app
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only the built output (Nitro)
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
