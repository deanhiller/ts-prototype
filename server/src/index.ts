  import dotenv from "dotenv";
  import express, { Express, Request, Response } from "express";
  import path from "path";
  import cors from "cors";
  import {myContainer} from "./inversify.config";
  import {BaseController} from "./controllers/baseController";
  import {TYPES} from "./types";
  import {LoginRequest, User} from "./apis/base/base";
  import { PrismaClient } from '@prisma/client'

  dotenv.config();

  const prisma = new PrismaClient()

  const app: Express = express();

  app.use(express.json());
  app.use(cors());

  // app.get('/', (req: Request, res: Response) => {
  //   res.send('Hello World From the Typescript Server!')
  // });

  interface FormInputs {
    email: string,
    password: string
  }



  const baseController = myContainer.get<BaseController>(TYPES.BaseController);

  console.log("starting");



  // route login
  app.post('/login', async (req: Request, res: Response) => {
    console.log("log stuff");
    const loginReq: LoginRequest = Object.assign(new LoginRequest(), req.body);
    const result = await baseController.login(loginReq);
    const body = JSON.stringify(result);
    return res.status(200).send(body);
  });

  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
  });

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
