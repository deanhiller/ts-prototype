import "reflect-metadata";
import {provideSingleton} from "./util/decorators";
import {PrismaClient, Prisma, UserDbo} from "@prisma/client";
import {PrismaClientFactory} from "./util/prismaClientFactory";

@provideSingleton(Bootstrap)
export class Bootstrap {

    private prisma: PrismaClient;

    public constructor(
        prismaFactory: PrismaClientFactory
    ) {
        this.prisma = prismaFactory.fetch();
    }

    public async setup(): Promise<void> {

        const users: UserDbo[] = await this.prisma.userDbo.findMany({
            skip: 0,
            take: 2,
        });

        console.log("Num users="+users.length);
        if(users.length === 0) {
            console.log("Initializing database with fake data");
            await this.populateDatabase();
            console.log("Database initialized");
        }

    }

    private async populateDatabase() {
        await this.prisma.userDbo.create({
            data: {
                email: "dean@biltup.com",
                name: "Dean Hiller"
            }
        })
    }


}
