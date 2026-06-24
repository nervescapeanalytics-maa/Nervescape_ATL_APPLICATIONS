#!/usr/bin/env bash
# ============================================================
# db-start.sh — Start standalone PostgreSQL 18 (rootless)
# ============================================================
set -euo pipefail

export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
PG_PORT=5433

if pg_isready -h 127.0.0.1 -p "$PG_PORT" -t 2 >/dev/null 2>&1; then
  echo "[db-start] PostgreSQL already running on 127.0.0.1:${PG_PORT}"
  exit 0
fi

echo "[db-start] Starting PostgreSQL (data: $PGDATA)..."
pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" start -w -t 15
sleep 1
pg_isready -h 127.0.0.1 -p "$PG_PORT"
echo "[db-start] PostgreSQL started ✓"
