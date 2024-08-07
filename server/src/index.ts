import 'source-map-support/register';

import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import {fetchMyContainer} from "./inversify.config";
import {TYPES} from "./types";
import {App} from "./app";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

console.log("fetching container");
const myContainer = fetchMyContainer(app);
const myApp = myContainer.get<App>(TYPES.App);

async function setupDatabase(): Promise<void> {
  try {
    await myApp.setupDatabase();
  } catch (error) {
    if(error instanceof Error) {
      console.error("Failure to setup DB but moving on.  stacktrace=" + error.stack);
    } else {
      console.error("Someone threw a bad object="+error);
    }
    console.log("Continuing on to start server without database");
  }
}

async function startServer(): Promise<void> {
  try {
    console.log("Starting server...");
    await myApp.start();

    await setupDatabase();

    console.log(`dir:${__dirname}`);

    const port = process.env.PORT || 8080;

    console.log(`About to listen on port ${port}`);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    });
  } catch (error) {
    if(error instanceof Error) {
      console.error("Server failed to start.  stacktrace=" + error.stack);
    } else {
      console.error("Someone threw a bad object(server failed to start)="+error);
    }
  }
}

const promise = startServer();
promise.catch((error) => {
      console.error("App Failed to start");
    }
)
