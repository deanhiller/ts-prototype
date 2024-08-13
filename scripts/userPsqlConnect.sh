#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

echo "Dir=${SCRIPT_DIR}"

echo "You must authorize your ip in google cloud SQL on the instance to use this method"

psql "sslmode=verify-ca sslrootcert=${SCRIPT_DIR}/../../keys/server-ca.pem sslcert=${SCRIPT_DIR}/../../keys/client-cert.pem sslkey=${SCRIPT_DIR}/../../keys/client-key.pem hostaddr=34.123.196.16 port=5432 user=app_user dbname=biltup"

