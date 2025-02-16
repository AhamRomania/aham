#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
CERTS="$ROOT_DIR/certs"

openssl req -x509 -newkey rsa:4096 -keyout $CERTS/cdn/key.pem -out $CERTS/cdn/cert.pem -days 365 -nodes