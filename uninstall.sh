#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "Stopping and removing NeoFreq container..."
docker compose down -v --rmi local 2>/dev/null || true

echo "Removing update cron job..."
crontab -l 2>/dev/null | grep -v 'neofreq/update.sh' | crontab - || true

echo "NeoFreq container and cron job successfully removed."
echo "To delete the directory, run: rm -rf $DIR"
