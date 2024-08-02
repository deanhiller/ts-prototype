import "reflect-metadata";

import {PrismaClient} from "@prisma/client";
import {provideSingleton} from "./decorators";

@provideSingleton(PrismaClientFactory)
export class PrismaClientFactory {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();

        console.log("prismaFactory!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }

    public fetch(): PrismaClient {
        return this.prisma;
    }

}

