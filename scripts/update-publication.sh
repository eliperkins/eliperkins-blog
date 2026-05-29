#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

uri=$(cat public/.well-known/site.standard.publication)
rkey="${uri##*/}"

goat record update -n -r "$rkey" scripts/publication.json
