import "reflect-metadata";

import express, { Express } from "express";
import {Bootstrap} from "./bootstrap";
import {BaseApiRouting} from "./baseApiRouting";
import path from "path";
import {provideSingleton} from "./util/decorators";
import {inject} from "inversify";
import {TYPES} from "./types";
import {RemoteApi} from "./apis/remote/remote";

@provideSingleton(App)
export class App {
    private _baseApiRouting: BaseApiRouting
    private _bootstrap: Bootstrap;
    private _app: Express;

    public constructor(
        baseApiRouting: BaseApiRouting,
        bootstrap: Bootstrap,
        @inject(TYPES.Express) app: Express
    ) {
        this._baseApiRouting = baseApiRouting;
        this._bootstrap = bootstrap;
        this._app = app;
    }

    async start(): Promise<void> {
        this._baseApiRouting.setupBaseController();

        //build/fuse/browser/
        this._app.use(express.static("${__dirname}/../../client/build/fuse/browser"));
        this._app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "..", "..", "client", "build", "fuse", "browser", "index.html"));
        });
    }

    async setupDatabase(): Promise<void> {
        return this._bootstrap.setup();
    }
}
