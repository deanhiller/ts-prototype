import 'source-map-support/register';

import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import {myContainer} from "./inversify.config";
import {BaseController} from "./controllers/baseController";
import {TYPES} from "./types";
import {setupBaseController} from "./baseApiRouting"

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

const baseController = myContainer.get<BaseController>(TYPES.BaseController);
setupBaseController(app, baseController)

console.log(`dir:${__dirname}`);

//build/fuse/browser/
app.use(express.static("${__dirname}/../../client/build/fuse/browser"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "client", "build", "fuse", "browser", "index.html"));
});

const port = process.env.PORT || 8080;

console.log(`About to listen on port ${port}`);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
