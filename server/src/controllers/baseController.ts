import "reflect-metadata";
import {inject, injectable} from "inversify";
import {BaseApi, LoginRequest, LoginResponse} from "../apis/base/base";
import {TYPES} from "../types";
import {BaseBusinessLogic} from "./baseBusinessLogic";
import {RemoteApi} from "../apis/remote/remote";
import {provide} from "inversify-binding-decorators";
import {PrismaClientFactory} from "./prismaClientFactory";
import {PrismaClient} from "@prisma/client";
import {provideSingleton} from "../util/decorators";

// Array of example users for testing purposes
const users = [
    {
        id: 1,
        name: 'Maria Doe',
        email: 'maria@example.com',
        password: 'maria123'
    },
    {
        id: 2,
        name: 'Juan Doe',
        email: 'juan@example.com',
        password: 'juan123'
    }
];

function throwError<T>(msg: string) {
    throw new Error(msg);
}

@provideSingleton(BaseController)
export class BaseController implements BaseApi {
    private _baseBizLogic: BaseBusinessLogic;

    public constructor(
        baseBizLogic: BaseBusinessLogic,
        @inject(TYPES.RemoteApi) remoteApi: RemoteApi
    ) {
        this._baseBizLogic = baseBizLogic;
    }

    async login(loginRequest: LoginRequest): Promise<LoginResponse> {

        const result = await this._baseBizLogic.sneak();
        console.log(result);

        const email = loginRequest.user?.name ?? throwError<string>("email is required");
        const password = loginRequest.user?.password ?? throwError<string>("password is required");

        const user = users.find(user => {
            return user.email === email && user.password === password
        });

        const response = new LoginResponse();
        if (!user) {
            response.loginSuccess = false;
            return response;
        }

        response.loginSuccess = true;
        return response;
    }
}
