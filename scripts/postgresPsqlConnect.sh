#!/bin/bash

echo "You must authorize your ip in google cloud SQL on the instance to use this method"

psql "sslmode=verify-ca sslrootcert=server-ca.pem sslcert=client-cert.pem sslkey=client-key.pem hostaddr=35.226.239.173 port=5432 user=postgres dbname=biltup-db"
