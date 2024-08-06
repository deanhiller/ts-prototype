#!/bin/bash

export TAG=latest

gcloud auth login
gcloud config set project biltup-community
gcloud auth configure-docker us-central1-docker.pkg.dev
docker buildx build -t us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG} .

## We just tag above during the build of the docker image instead
## We could tag with version here in addition to latest.  We MUST use latest as our deploy chooses latest to deploy
####docker tag ${hashOfBuiltImage} us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG}

docker push us-central1-docker.pkg.dev/biltup-community/biltup-repo/prototype-image:${TAG}
