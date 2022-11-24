#!/bin/sh
set -e
# Generate env for runtime use
touch public/__ENV.js
chmod 777 public/__ENV.js
yarn react-env --env APP_ENV
# Execute any subsequent command
exec "$@"
