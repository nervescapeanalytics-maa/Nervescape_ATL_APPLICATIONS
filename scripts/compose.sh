#!/usr/bin/env bash
# Run podman-compose as appuser with a correct rootless environment.
export XDG_RUNTIME_DIR=/run/user/$(id -u)
unset DBUS_SESSION_BUS_ADDRESS
cd /home/appuser/APP_HOME
exec podman-compose "$@"
