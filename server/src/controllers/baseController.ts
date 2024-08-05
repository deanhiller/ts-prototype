import "reflect-metadata";
import {inject, injectable} from "inversify";
import {BaseApi, LoginRequest, LoginResponse, User} from "../apis/base/base";
import {TYPES} from "../types";
import {BaseBusinessLogic} from "./baseBusinessLogic";
import {RemoteApi} from "../apis/remote/remote";
import {provideSingleton} from "../util/decorators";
import {BadRequestError, UnauthorizedError} from "../apis/util/apiUtils";

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
        photoUrl: "assets/images/avatars/brian-hughes.jpg",
        name: 'Someone',
        email: 'admin@fusetheme.com',
        password: 'admin'
    }
];

function throwError<T>(msg: string, field: string) {
    throw new BadRequestError(msg, field);
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

        const email = loginRequest.name ?? throwError<string>("email is required", "email");
        const password = loginRequest.password ?? throwError<string>("password is required", "password");

        const user = users.find(user => {
            return user.email === email && user.password === password
        });

        const response = new LoginResponse();
        if (!user) {
            throw new UnauthorizedError("User/password is not found");
        }

        response.user = new User();
        response.user.email = user.email;
        response.user.displayName = user.name;
        response.user.role = user.role;
        response.user.photoUrl = user.photoUrl;

        response.loginSuccess = true;
        return response;
    }
}
