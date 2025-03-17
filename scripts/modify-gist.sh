#!/usr/bin/env bash

GIST_KEY="$1"
GIST_ID="$2"

if [ -z "$GIST_KEY" ]; then
  echo "GIST_KEY is required"
  echo "Usage: $0 <GIST_KEY> <GIST_ID>"
  exit 1
fi
if [ -z "$GIST_ID" ]; then
  echo "GIST_ID is required"
  echo "Usage: $0 <GIST_KEY> <GIST_ID>"
  exit 1
fi

resp=$(curl \
  --write-out '%{http_code}' \
  -L \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GIST_KEY" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  --silent \
  --output /dev/null \
  "https://api.github.com/gists/$GIST_ID" \
  -d '{"files":{"instruction-coverage.json":{"content":"Hello World from GitHub"}}}')

if [ $resp -eq 200 ]; then
  echo "Gist updated successfully"
else
  echo "Failed to update gist"
  exit 1
fi
