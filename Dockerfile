# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN yarn install --non-interactive --silent
COPY frontend/ .
RUN NODE_ENV=production yarn build

# ── Stage 2: Combined service (nginx + FastAPI) ───────────────────────────────
FROM python:3.11-slim

# nginx for serving the frontend and proxying /api → localhost:8000
RUN apt-get update && apt-get install -y nginx gettext-base && rm -rf /var/lib/apt/lists/*

# Python backend
WORKDIR /backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# React static files
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# nginx config template — ${PORT} is resolved at container start
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Railway injects PORT; default to 80 for local docker run
ENV PORT=80
EXPOSE 80

# 1. envsubst fills in ${PORT} (only that variable, nginx's own $host etc. are untouched)
# 2. nginx starts as a daemon (exits 0 after forking)
# 3. uvicorn runs in the foreground — container lives as long as the API does
CMD ["bash", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx && uvicorn main:app --host 0.0.0.0 --port 8000"]
