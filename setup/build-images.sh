#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
BIN_PATH="$ROOT_DIR/bin"

# WEB

docker build --no-cache -t cosminalbu/aham:web -f $SCRIPT_DIR/docker/build/web $ROOT_DIR/web

if [ "$1" = "publish" ]; then
    docker push cosminalbu/aham:web
fi

# CDN

cd $SCRIPT_DIR/../backend/service/cdn/ && env CGO_ENABLED=0 GOOS=linux GARCH=amd64 go build -o $BIN_PATH/cdn -a -ldflags '-extldflags "-static"' main.go

chmod +x $BIN_PATH/cdn

docker build --no-cache -t cosminalbu/aham:cdn -f $SCRIPT_DIR/docker/build/cdn $ROOT_DIR

if [ "$1" = "publish" ]; then
    docker push cosminalbu/aham:cdn
fi

rm $BIN_PATH/cdn

# API

cd $SCRIPT_DIR/../backend/service/api/ && env CGO_ENABLED=0 GOOS=linux GARCH=amd64 go build -o $BIN_PATH/api -a -ldflags '-extldflags "-static"' main.go

chmod +x $BIN_PATH/api

docker build --no-cache -t cosminalbu/aham:api -f $SCRIPT_DIR/docker/build/api $ROOT_DIR


if [ "$1" = "publish" ]; then
    docker push cosminalbu/aham:api    
fi

rm $BIN_PATH/api

docker compose -f $SCRIPT_DIR/docker/compose/production.yml -p ahamprod down
docker compose -f $SCRIPT_DIR/docker/compose/production.yml -p ahamprod up -d