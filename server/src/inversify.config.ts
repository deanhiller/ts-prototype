// file inversify.inversify.config.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { buildProviderModule } from "inversify-binding-decorators";
import {FakeRemoteApi} from "./controllers/fakeRemoteApi";
import {RemoteApi} from "./apis/remote/remote";
import {App} from "./app";
import { Express } from "express";
import {PrismaClient} from "@prisma/client";
import Logger from "bunyan";

const bunyan = require('bunyan');
// Imports the Google Cloud client library for Bunyan
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');

function throwExc(): string {
    throw new Error("Missing definition of DATABASE_URL");
}

function bindPrisma(myContainer: Container, express: Express | null, logger: Logger): void {
    let databaseUrl = "postgresql://postgres:password@localhost:5432/biltup";
    if (process.env.NODE_ENV === 'production') {
        logger.info("Running in production mode");
        databaseUrl = process.env.DATABASE_URL ?? throwExc();
    } else {
        logger.info("Running dev mode.  url=" + databaseUrl);
    }

    const prismaClient = new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
    })

    myContainer.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prismaClient);
}

function bindLogger(myContainer: Container): Logger {
    // Creates a Bunyan Cloud Logging client
    const loggingBunyan = new LoggingBunyan();

    let streams = [{stream: process.stdout, level: 'info'}]
    if (process.env.NODE_ENV === 'production') {
        console.error("Running logging in production");
        streams = [loggingBunyan.stream('info')];
    } else {
        console.log("Running logging in development");
    }

// Create a Bunyan logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
    const logger: Logger = bunyan.createLogger({
        // The JSON payload of the log as it appears in Cloud Logging
        // will contain "name": "my-service"
        name: 'my-service',
        streams: streams ,
    });

    myContainer.bind<Logger>(TYPES.Logger).toConstantValue(logger);

    return logger;
}

export function fetchMyContainer(express:Express|null): Container {
    const myContainer = new Container();
    myContainer.load(buildProviderModule());

    const logger = bindLogger(myContainer);
    bindPrisma(myContainer, express, logger);

    const loggingBunyan = new LoggingBunyan();

    if(express) {
        myContainer.bind<Express>(TYPES.Express).toConstantValue(express);
    }
    myContainer.bind<App>(TYPES.App).to(App).inSingletonScope();
    myContainer.bind<RemoteApi>(TYPES.RemoteApi).to(FakeRemoteApi).inSingletonScope();

    return myContainer;
}
