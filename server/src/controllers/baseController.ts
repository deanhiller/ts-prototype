import "reflect-metadata";
import {inject, injectable} from "inversify";
import {BaseApi, LoginRequest, LoginResponse} from "../apis/base/base";
import {TYPES} from "../types";
import {BaseBusinessLogic} from "./baseBusinessLogic";
import {RemoteApi} from "../apis/remote/remote";
import {provide} from "inversify-binding-decorators";

@provide(BaseController)
export class BaseController implements BaseApi {
    private _baseBizLogic: BaseBusinessLogic;

    public constructor(
        baseBizLogic: BaseBusinessLogic,
        @inject(TYPES.RemoteApi) remoteApi: RemoteApi
    ) {
        this._baseBizLogic = baseBizLogic;
    }

    login(loginRequest: LoginRequest): LoginResponse {

        const result = this._baseBizLogic.sneak();
        console.log(result);

        const response = new LoginResponse();
        response.loginSuccess = true;
        return response;
    }
}
