#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

git fetch origin main >/dev/null 2>&1
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] New changes detected on GitHub. Pulling and rebuilding NeoFreq..."
    git pull origin main
    docker compose up -d --build --remove-orphans
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Update complete!"
fi
