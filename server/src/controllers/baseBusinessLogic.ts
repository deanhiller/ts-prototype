import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import {provideSingleton} from "../util/decorators";
import {inject} from "inversify";
import {TYPES} from "../types";

@provideSingleton(BaseBusinessLogic)
class BaseBusinessLogic {
    private prisma: PrismaClient;

    public constructor(
        @inject(TYPES.PrismaClient) prisma: PrismaClient
    ) {
        this.prisma = prisma;
    }

    public async sneak(): Promise<string> {

        const allUsers = await this.prisma.userDbo.findMany()
        console.log(allUsers)

        return "deano"
    }

}

export { BaseBusinessLogic };
