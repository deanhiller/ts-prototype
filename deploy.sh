#!/bin/bash

export TAG=tag1

gcloud auth configure-docker us-central1-docker.pkg.dev
docker buildx build .

docker tag 95eee2402110 us-central1-docker.pkg.dev/deansprototype/ts-prototype/prototype-image:${TAG}

docker push us-central1-docker.pkg.dev/deansprototype/ts-prototype/prototype-image:${TAG}
