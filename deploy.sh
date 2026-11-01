#!/bin/sh
# Publica no Cloudflare Pages (projeto dna)
set -e
cd "$(dirname "$0")"
./build.sh
npx wrangler pages deploy dist --project-name dna --branch "${1:-main}" --commit-dirty=true
