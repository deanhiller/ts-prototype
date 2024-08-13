import 'source-map-support/register';

import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import {fetchMyContainer} from "./inversify.config";
import {TYPES} from "./types";
import {App} from "./app";
import Logger from "bunyan";
import net from 'node:net';
import {promisify} from 'util';
import {PrismaClient} from '@prisma/client'
import {Connector} from '@google-cloud/cloud-sql-connector';

console.log("FIRST log.  Starting server");
dotenv.config();

const app: Express = express();

// use this to let express know it is on a encrypted connection
app.use(function(req, res, next) {
  var schema = req.headers["x-forwarded-proto"];

  console.log(`x-forwarded-proto: ${schema}`);

  next();
});

app.use(express.json());
app.use(cors());

console.log("fetching container");
const myContainer = fetchMyContainer(app);
const myApp = myContainer.get<App>(TYPES.App);
const logger = myContainer.get<Logger>(TYPES.Logger);

//A few choices and went with first one that worked.
//Need to revisit later
//https://github.com/prisma/prisma/blob/754620fcf105788f09c31a3a2f461852ad432eea/docs/core/connectors/postgresql.md#configuring-an-ssl-connection
//https://github.com/GoogleCloudPlatform/cloud-sql-nodejs-connector/issues/113
//https://cloud.google.com/sql/docs/postgres/sql-proxy
//https://github.com/prisma/prisma/discussions/22899

async function setupDbProxy(): Promise<number> {
  if (process.env.NODE_ENV !== 'production') {
    return new Promise<number>((resolve, reject) => {
      resolve(10);
    });
  }

  logger.info("Starting database proxy server");
  const connector = new Connector();
  const {stream} = await connector.getOptions({
    instanceConnectionName: 'biltup-community:us-central1:biltup-db',
  });

// In-process proxy to redirect from localhost:8080 to the Cloud SQL Instance
  const server = net.createServer((c) => {
    const s = stream();
    c.pipe(s);
    s.pipe(c);
  });
  server.on('error', (err) => {
    throw err;
  });

  const port = 5432;

  const promise = new Promise<number>((resolve, reject) => {
    server.listen(port, "localhost", () => {
      logger.info(`Proxy server listening on localhost:${port}`)
      resolve(50);
    });
  });

  return promise
}

async function setupDatabase(): Promise<void> {
  try {
    await myApp.setupDatabase();
  } catch (error) {
    if(error instanceof Error) {
      logger.error("Failure to setup DB but moving on.  stacktrace=" + error.stack);
    } else {
      logger.error("Someone threw a bad object="+error);
    }
    logger.info("Continuing on to start server without database");
  }
}

async function startServer(): Promise<void> {
  try {
    await setupDbProxy()
    logger.info("Starting application...");
    await myApp.start();

    await setupDatabase();

    logger.info(`dir:${__dirname}`);

    const port = process.env.PORT || 8080;

    logger.info(`About to listen on port ${port}`);
    app.listen(port, () => {
      logger.info(`Example app listening on port ${port}`)
    });
  } catch (error) {
    if(error instanceof Error) {
      logger.error("Server failed to start.  stacktrace=" + error.stack);
    } else {
      logger.error("Someone threw a bad object(server failed to start)="+error);
    }
  }
}

const promise = startServer();
promise.catch((error) => {
      logger.error("App Failed to start");
    }
)
