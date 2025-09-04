#!/usr/bin/env bash
set -euo pipefail

# Environment setup
export PORT="${PORT:-8099}"
export UI_DIST="${UI_DIST:-/opt/nexdom/ui/dist}"

# Supervisor token is provided by HA add-on environment
if [[ -z "${SUPERVISOR_TOKEN:-}" ]]; then
  echo "[nexdom] SUPERVISOR_TOKEN not present in env; exiting" >&2
  exit 1
fi

echo "[nexdom] Starting server on port ${PORT}"
node /opt/nexdom/server/dist/index.js

