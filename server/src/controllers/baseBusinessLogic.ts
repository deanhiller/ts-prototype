import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { PrismaClientFactory } from "../util/prismaClientFactory"
import {provideSingleton} from "../util/decorators";

@provideSingleton(BaseBusinessLogic)
class BaseBusinessLogic {
    private prisma: PrismaClient;

    public constructor(
        prismaFactory: PrismaClientFactory
    ) {
        this.prisma = prismaFactory.fetch();
    }

    public async sneak(): Promise<string> {

        const allUsers = await this.prisma.user.findMany()
        console.log(allUsers)

        return "deano"
    }

}

export { BaseBusinessLogic };
