#!/bin/bash
set -euo pipefail

cd /opt/guiding-hand

git fetch -q origin main

if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  git pull -q --ff-only
  export APP_SHA="$(git rev-parse --short HEAD)"
  docker compose up -d --build
  docker image prune -f
fi
