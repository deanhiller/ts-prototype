#!/bin/bash

rm -rf server/dist
rm -rf client/dist
rm -rf server/node_modules
rm -rf client/node_modules

./build.sh

