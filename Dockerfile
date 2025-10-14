# Use Bun's official image
FROM oven/bun:1 AS base

# Pass build args for environment
ARG NUXT_UMAMI_HOST
ARG NUXT_UMAMI_ID

# Set environment variables
ENV NUXT_UMAMI_HOST=$NUXT_UMAMI_HOST
ENV NUXT_UMAMI_ID=$NUXT_UMAMI_ID
ENV HOST=0.0.0.0

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy source code

# Skip optional deps and postinstall scripts
# (Bun honors npm_config_optional and --ignore-scripts)
ENV npm_config_optional=false
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the rest and build
COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
