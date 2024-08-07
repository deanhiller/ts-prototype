import "reflect-metadata";
import {provideSingleton} from "./util/decorators";
import {PrismaClient, Prisma, UserDbo} from "@prisma/client";
import {inject} from "inversify";
import {TYPES} from "./types";
import * as CryptoJS from 'crypto-js';

// Array of example users for testing purposes
const users = [
    {
        id: 1,
        role: "admin",
        photoUrl: "assets/images/avatars/brian-hughes.jpg",
        name: 'Maria Doe',
        email: 'maria@example.com',
        password: 'maria123'
    },
    {
        id: 2,
        role: "admin",
        photoUrl: "assets/images/avatars/brian-hughes.jpg",
        name: 'Juan Doe',
        email: 'juan@example.com',
        password: 'juan123'
    },
    {
        id: 3,
        role: "admin",
        photoUrl: "images/avatars/brian-hughes.jpg",
        name: 'Someone',
        email: 'hughes.brian@company.com',
        password: 'admin'
    }
];
@provideSingleton(Bootstrap)
export class Bootstrap {

    private prisma: PrismaClient;

    public constructor(
        @inject(TYPES.PrismaClient) prisma: PrismaClient
    ) {
        this.prisma = prisma;
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
        } else {
            console.log("Database already has data");
        }

    }

    private async populateDatabase() {

        const password = "admin";
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        await this.prisma.userDbo.create({
            data: {
                email: "dean@biltup.com",
                name: "Dean Hiller",
                photoUrl: "images/avatars/brian-hughes.jpg",
                hashedPassword: hashedPassword,
                user_roles: {
                    create: {
                        name: "admin"
                    }
                }
            }
        })
    }


}
