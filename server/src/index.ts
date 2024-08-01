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

  // Array of example users for testing purposes
  const users = [
    {
      id: 1,
      name: 'Maria Doe',
      email: 'maria@example.com',
      password: 'maria123'
    },
    {
      id: 2,
      name: 'Juan Doe',
      email: 'juan@example.com',
      password: 'juan123'
    }
  ];

  const baseController = myContainer.get<BaseController>(TYPES.BaseController);

  console.log("starting");

  function throwError<T>(msg: string): T {
    throw Error(msg);
  }

  // route login
  app.post('/login', async (req: Request, res: Response) => {
    console.log("log stuff");

    const allUsers = await prisma.user.findMany()
    console.log(allUsers)

    const loginReq: LoginRequest = Object.assign(new LoginRequest(), req.body);
    const email = loginReq.user?.name ?? throwError<string>("email is required");
    const password = loginReq.user?.password ?? throwError<string>("password is required");

    baseController.login(loginReq);

    const user = users.find(user => {
      return user.email === email && user.password === password
    });

    if (!user) {
      return res.status(404).send('User Not Found!')
    }

    return res.status(200).json(user)
  });

  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
  });

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
