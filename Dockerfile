FROM node:18

WORKDIR /usr/src/clean-node-api

RUN npm install --only=prod
