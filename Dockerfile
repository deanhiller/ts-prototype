FROM node:22.5-alpine

RUN mkdir -p /home/node/app/server && mkdir -p /home/node/app/client

WORKDIR /home/node/app/server

COPY server/package*.json ./
COPY client/package*.json ../client

RUN chown -R node:node /home/node/app
USER node

RUN echo "hello there $(pwd)"
RUN echo "app $(ls -la /home/node/app)"
RUN echo "server $(ls -la /home/node/app/server)"

RUN npm install
RUN cd ../client && npm install

COPY --chown=node:node . .

EXPOSE 8080

#node dist/index.js
CMD [ "node", "dist/index.js" ]
