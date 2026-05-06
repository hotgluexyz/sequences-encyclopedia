#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

trap 'kill 0' EXIT

"$ROOT/api/.venv/bin/python" "$ROOT/api/app.py" &
npm --prefix "$ROOT/website" run dev &

wait
