#!/usr/bin/env bash
set -euo pipefail

# Load .env file if present (docker compose reads it too, but we need it for the guard check below)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
  set +a
fi

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  printf '\n  \033[1;31mERROR:\033[0m ANTHROPIC_API_KEY is not set.\n\n'
  printf '  Usage:  ANTHROPIC_API_KEY=sk-ant-... ./start.sh\n'
  printf '  Or:     export ANTHROPIC_API_KEY=sk-ant-...\n'
  printf '          ./start.sh\n\n'
  exit 1
fi

printf '\n\033[1;36m  ╔══════════════════════════════════════╗\033[0m\n'
printf '\033[1;36m  ║      Personality Chatbot — Boot      ║\033[0m\n'
printf '\033[1;36m  ╚══════════════════════════════════════╝\033[0m\n\n'

docker compose up --build -d

printf '\n  \033[1;32m✓ Services started\033[0m\n\n'
printf '  Frontend  →  \033[4mhttp://localhost:3000\033[0m\n'
printf '  Backend   →  \033[4mhttp://localhost:8000\033[0m\n\n'
printf '  Follow logs :  docker compose logs -f\n'
printf '  Stop        :  docker compose down\n\n'
