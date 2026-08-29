#!/bin/bash
set -e
echo "Building API..."
bun run build:api
echo "Building Web..."
bun run build:web
echo "Deploying API Worker..."
cd apps/api && npx wrangler deploy && cd ../..
echo "Deploying Web to Pages..."
npx wrangler pages deploy apps/web/dist --project-name=relief-vehicle
echo "Done."
