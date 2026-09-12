#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

git fetch origin main >/dev/null 2>&1
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
LAST_BUILT=$(cat .last_build 2>/dev/null || echo "")

if [ "$LOCAL" != "$REMOTE" ] || [ "$REMOTE" != "$LAST_BUILT" ]; then
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Updates detected on GitHub. Pulling and rebuilding NeoFreq..."
    git pull origin main
    docker compose up -d --build --remove-orphans
    git rev-parse HEAD > .last_build
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Update complete!"
fi
