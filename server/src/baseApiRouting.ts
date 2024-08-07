import "reflect-metadata";

import {BaseController} from "./controllers/baseController";
import { Express, Request, Response } from "express";
import {LoginRequest, User} from "./apis/base/base";
import {provideSingleton, translateOrReturn} from "./util/decorators";
import {inject} from "inversify";
import {TYPES} from "./types";

@provideSingleton(BaseApiRouting)
export class BaseApiRouting {
    private _baseController: BaseController;
    private app: Express;

    public constructor(
        @inject(TYPES.Express) app: Express,
        baseController: BaseController
    ) {
        this.app = app;
        this._baseController = baseController;
    }


    setupBaseController() {
// route login
        this.app.post('/login', async (req: Request, res: Response) => {
            return translateOrReturn(res, async () => {
                console.log("log stuff");
                const loginReq: LoginRequest = Object.assign(new LoginRequest(), req.body);
                const result = await this._baseController.login(loginReq);
                const body = JSON.stringify(result);
                return res.status(200).send(body);
            });
        });


    }
}
