import "reflect-metadata";

import {BaseController} from "./controllers/baseController";
import { Express, Request, Response } from "express";
import {LoginRequest, LoginResponse, SignupRequest, SignupResponse, User} from "./apis/base/base";
import {provideSingleton, translateOrReturn} from "./util/decorators";
import {inject} from "inversify";
import {TYPES} from "./types";
import Logger from "bunyan";

@provideSingleton(BaseApiRouting)
export class BaseApiRouting {
    private _baseController: BaseController;
    private app: Express;
    private _logger: Logger;

    public constructor(
        @inject(TYPES.Express) app: Express,
        baseController: BaseController,
        @inject(TYPES.Logger) logger: Logger
    ) {
        this.app = app;
        this._baseController = baseController;
        this._logger = logger;
    }

    setupBaseController() {
// route login
        this.app.post('/api/login', async (req: Request, res: Response) => {
            return translateOrReturn<LoginResponse>(this._logger, res, async () => {
                const request = Object.assign(new LoginRequest(), req.body);
                return await this._baseController.login(request);
            });
        });

        this.app.post('/api/signup', async (req: Request, res: Response) => {
            return translateOrReturn<SignupResponse>(this._logger, res, async () => {
                const request = Object.assign(new SignupRequest(), req.body);
                return await this._baseController.signup(request);
            });
        });

    }
}
