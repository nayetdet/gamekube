#!/usr/bin/env bash

set -euo pipefail

readonly REDISCLI_AUTH='redis'

kubectl exec -n gamekube gamekube-redis-master-0 -- \
  env REDISCLI_AUTH="$REDISCLI_AUTH" sh -c \
  'redis-cli --scan | while read -r key; do redis-cli UNLINK "$key"; done'
