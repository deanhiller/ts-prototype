#!/bin/bash

cd server
npm install
npm run build

cd ../

cd client
npm install
npm run build
