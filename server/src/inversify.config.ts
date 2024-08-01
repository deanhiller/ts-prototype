// file inversify.inversify.config.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import {BaseController} from "./controllers/baseController";
import {FakeRemoteApi} from "./controllers/fakeRemoteApi";
import {RemoteApi} from "./apis/remote/remote";
import {PrismaClient} from "@prisma/client";
import { decorate, injectable } from "inversify";

const myContainer = new Container();
myContainer.load(buildProviderModule());

//these 3 lines to bind prisma client
decorate(injectable(), PrismaClient)
const prisma = new PrismaClient()
// @ts-ignore
myContainer.bind<PrismaClient>(TYPES.PrismaClient).to(prisma).inSingletonScope();


myContainer.bind<BaseController>(TYPES.BaseController).to(BaseController).inSingletonScope();
myContainer.bind<RemoteApi>(TYPES.RemoteApi).to(FakeRemoteApi).inSingletonScope();

export { myContainer };
