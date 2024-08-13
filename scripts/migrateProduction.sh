#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
echo "Dir=${SCRIPT_DIR}"

cd ${SCRIPT_DIR}/../server

export DATABASE_URL="postgresql://app_user:1l3kjs8$%^salw23@34.123.196.16:5432/biltup?sslcert=../../../keys/server-ca.pem&sslidentity=../../../keys/client-cert.p12&sslpassword=password" 

npx prisma migrate deploy

