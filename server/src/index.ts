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

const myContainer = fetchMyContainer(app);
const myApp = myContainer.get<App>(TYPES.App);
const promise = myApp.start();

console.log("Checking database");

promise.then( () => {
  console.log(`dir:${__dirname}`);

  const port = process.env.PORT || 8080;

  console.log(`About to listen on port ${port}`);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
});
