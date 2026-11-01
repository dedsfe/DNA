#!/bin/sh
# Monta dist/ só com o que é público (nada de StackVault, .env ou scripts)
set -e
rm -rf dist && mkdir dist
cp *.html *.css script.js dist/
cp -R assets site dist/
cp _headers dist/ 2>/dev/null || true
