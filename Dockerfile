# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache ca-certificates openssl libc6-compat

COPY certs/corporate-ca.crt /usr/local/share/ca-certificates/corporate-ca.crt
RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/corporate-ca.crt

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY prisma ./prisma
RUN npx prisma generate || (echo "Prisma generate failed with TLS, retrying insecurely" && NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate)

COPY tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev --ignore-scripts

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

USER node

CMD ["node", "dist/index.js"]
 
