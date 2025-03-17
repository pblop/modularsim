#!/usr/bin/env bash

# This script generates a JSON file representing the badges for the
# repository and uploads it to a Gist.

GIST_KEY="$1"
GIST_ID="$2"

files="$(bun ./scripts/instruction-coverage.ts)"
./scripts/modify-gist.sh "$GIST_KEY" "$GIST_ID" "$files"
exit $?