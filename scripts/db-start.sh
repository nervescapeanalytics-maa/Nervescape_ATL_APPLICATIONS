#!/usr/bin/env bash
# Start the standalone PostgreSQL server (runs as appuser, data in DB_HOME)
set -euo pipefail
export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
if pg_isready -h 127.0.0.1 -p 5433 >/dev/null 2>&1; then
  echo "PostgreSQL already running on 127.0.0.1:5433"
  exit 0
fi
pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" start
sleep 2
pg_isready -h 127.0.0.1 -p 5433
echo "PostgreSQL started (data dir: $PGDATA)"
