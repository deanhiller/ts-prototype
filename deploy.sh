#!/bin/bash

set -o errexit

export TAG=latest

# Check if any account with the domain @biltup.com is logged in
if gcloud auth list --format="value(account)" | grep -q "@biltup.com"; then
  echo "An account with @biltup.com domain is already logged in."
else
  echo "No @biltup.com account is logged in. Performing gcloud auth login..."
  gcloud auth login
fi

gcloud config set project biltup-community
gcloud auth configure-docker us-central1-docker.pkg.dev
docker buildx build -t us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG} .

## We just tag above during the build of the docker image instead
## We could tag with version here in addition to latest.  We MUST use latest as our deploy chooses latest to deploy
####docker tag ${hashOfBuiltImage} us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG}

docker push us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG}

gcloud run deploy bltup-service \
  --image us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG} \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
