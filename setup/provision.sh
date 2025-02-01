#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname $SCRIPT_DIR)"

go install github.com/air-verse/air@latest