#!/usr/bin/env bash
# Status of the standalone PostgreSQL server
set -uo pipefail
export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
pg_ctl -D "$PGDATA" status || true
pg_isready -h 127.0.0.1 -p 5433
