#!/usr/bin/env bash
# ============================================================
# db-stop.sh — Stop standalone PostgreSQL 18
# ============================================================
set -euo pipefail

export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
PG_PORT=5433

if ! pg_isready -h 127.0.0.1 -p "$PG_PORT" -t 2 >/dev/null 2>&1; then
  echo "[db-stop] PostgreSQL is not running — nothing to stop."
  exit 0
fi

pg_ctl -D "$PGDATA" stop -m fast
echo "[db-stop] PostgreSQL stopped ✓"
