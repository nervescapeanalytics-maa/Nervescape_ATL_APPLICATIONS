#!/usr/bin/env bash
# ============================================================
# db-status.sh — Show PostgreSQL 18 status
# ============================================================
set -uo pipefail

export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
PG_PORT=5433

pg_ctl -D "$PGDATA" status 2>/dev/null || echo "  PostgreSQL: not running"
if pg_isready -h 127.0.0.1 -p "$PG_PORT" -t 2 >/dev/null 2>&1; then
  echo "  ✓ PostgreSQL accepting connections on 127.0.0.1:${PG_PORT}"
else
  echo "  ✗ PostgreSQL not accepting connections on port ${PG_PORT}"
fi
