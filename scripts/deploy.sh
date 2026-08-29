#!/usr/bin/env bash
set -e

of="$1"

if [[ -z "$of" ]];then
	echo "No scope provided"
fi

if [[ "$of" == "api" ]];then
	echo "Building API..."
	bun run build:api
	echo "Deploying API Worker..."
	cd apps/api && npx wrangler deploy && cd ../..
	echo "Done."
fi


if [[ "$of" == "web" ]];then
	echo "Building Web..."
	bun run build:web
	echo "Deploying Web to Pages..."
	npx wrangler pages deploy apps/web/dist --project-name=relief-vehicle
	echo "Done."
fi
