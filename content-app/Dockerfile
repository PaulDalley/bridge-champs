# Cloud Run image for the Next.js content app (standalone output).
# Builds WITHOUT Firestore credentials (generateStaticParams fails soft -> pages
# render on-demand via ISR using the Cloud Run runtime service account at request time).

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
# Next standalone bundles only what's needed.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 8080
CMD ["node", "server.js"]
