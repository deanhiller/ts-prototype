FROM node:22.5-alpine

RUN mkdir -p /home/node/app/server && mkdir -p /home/node/app/client

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app
USER node

COPY --chown=node:node client/ ./client
COPY --chown=node:node server/ ./server

RUN cd ./client && npm install
RUN cd ./server && npm install

RUN echo "hello there $(pwd)"
RUN echo "app $(ls -la /home/node/app)"
RUN echo "clientlist $(ls -la /home/node/app/client)"
RUN echo "serverlist $(ls -la /home/node/app/server)"
RUN echo "server $(ls -la /home/node/app/server/build)"

RUN cd ./client && npm run build
RUN cd ./server && npm run build

RUN echo "serverlist2 $(ls -la /home/node/app/server)"

EXPOSE 8080

WORKDIR /home/node/app/server

#node dist/index.js
CMD [ "node", "build/index.js" ]
