import {BaseController} from "./controllers/baseController";
import express, { Express, Request, Response } from "express";
import {LoginRequest, User} from "./apis/base/base";
import {translateOrReturn} from "./util/decorators";

export function setupBaseController(app: Express, baseController: BaseController) {
// route login
    app.post('/login', async (req: Request, res: Response) => {
        return translateOrReturn(res, async () => {
            console.log("log stuff");
            const loginReq: LoginRequest = Object.assign(new LoginRequest(), req.body);
            const result = await baseController.login(loginReq);
            const body = JSON.stringify(result);
            return res.status(200).send(body);
        });
    });




}
