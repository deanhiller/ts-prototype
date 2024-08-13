#!/bin/bash

#GENERALLY USE THIS so we do not need to temporarily whitelist ips to access database


SCRIPT_DIR="$(dirname "$(realpath "$0")")"
echo "Dir=${SCRIPT_DIR}"

# Check if any account with the domain @biltup.com is logged in
if gcloud auth list --format="value(account)" | grep -q "@biltup.com"; then
  echo "An account with @biltup.com domain is already logged in."
else
  echo "No @biltup.com account is logged in. Performing gcloud auth login..."
  gcloud auth login
fi

gcloud config set project biltup-community
#This cmd is the same with other options too -> gcloud sql generate-login-token
gcloud auth application-default print-access-token > ${SCRIPT_DIR}/../../keys/token.txt

export PGSSLMODE=verify-ca
export PGSSLROOTCERT=${SCRIPT_DIR}/../../keys/server-ca.pem
export PGSSLCERT=${SCRIPT_DIR}/../../keys/client-cert.pem
export PGSSLKEY=${SCRIPT_DIR}/../../keys/client-key.pem

gcloud sql connect biltup-db --database=postgres --user=postgres --access-token-file=${SCRIPT_DIR}/../../keys/token.txt
