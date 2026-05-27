# ── Build Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN yarn install --non-interactive --silent

COPY . .
RUN NODE_ENV=production yarn build

# ── Production Stage ──────────────────────────────────────────────────────────
# nginx serves the static bundle AND proxies /api → backend (required for SSE).
# Using nginx:alpine instead of node+serve: smaller image, no extra install step.
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
