#!/usr/bin/env bash
# Stop the standalone PostgreSQL server
set -euo pipefail
export PATH=/usr/pgsql-18/bin:$PATH
PGDATA="${PGDATA:-/home/appuser/DB_HOME/pgdata}"
pg_ctl -D "$PGDATA" stop -m fast
echo "PostgreSQL stopped"
