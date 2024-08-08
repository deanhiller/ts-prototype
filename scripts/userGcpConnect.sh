#!/bin/bash

gcloud auth login
gcloud config set project spamfilter-397519

export PGSSLMODE=verify-ca
export PGSSLROOTCERT=server-ca.pem
export PGSSLCERT=client-cert.pem
export PGSSLKEY=client-key.pem

#This cmd is the same with other options too -> gcloud sql generate-login-token
gcloud auth application-default print-access-token > token.txt

gcloud sql connect spamfilter --database=spamfilter --user=spamfiltersvc --access-token-file=token.txt
