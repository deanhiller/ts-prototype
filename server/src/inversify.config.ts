// file inversify.inversify.config.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import {BaseController} from "./controllers/baseController";
import {FakeRemoteApi} from "./controllers/fakeRemoteApi";
import {RemoteApi} from "./apis/remote/remote";
import {App} from "./app";
import { Express } from "express";
import {PrismaClient} from "@prisma/client";

export function fetchMyContainer(express:Express|null): Container {
    const myContainer = new Container();
    myContainer.load(buildProviderModule());

//did not work.  used workaround of PrismaClientFactory instead..
// //these 3 lines to bind prisma client
// decorate(injectable(), PrismaClient)
// const prisma = new PrismaClient()
// // @ts-ignore
// myContainer.bind<PrismaClient>(TYPES.PrismaClient).to(prisma).inSingletonScope();

    const prismaClient = new PrismaClient();

    if(express) {
        myContainer.bind<Express>(TYPES.Express).toConstantValue(express);
    }

    myContainer.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prismaClient);
    myContainer.bind<App>(TYPES.App).to(App).inSingletonScope();
    myContainer.bind<RemoteApi>(TYPES.RemoteApi).to(FakeRemoteApi).inSingletonScope();

    return myContainer;
}
