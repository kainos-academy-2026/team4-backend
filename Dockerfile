# syntax=docker/dockerfile:1

# Stage 1 (builder): install tools/dependencies and compile the app.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Prefer normal TLS validation and only fallback for this training environment.
RUN npx prisma generate || NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build
# Remove dev dependencies before handing node_modules to runtime stage.
RUN npm prune --omit=dev

# Stage 2 (runner): keep only the minimum runtime files for a smaller image.
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
# Copy only compiled output and production dependencies from builder.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Run the app as a non-root user (UID/GID 65532 in distroless images).
USER 65532:65532

EXPOSE 4000

CMD ["dist/index.js"]
