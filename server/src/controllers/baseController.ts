import 'source-map-support/register';
import "reflect-metadata";
import {inject, injectable} from "inversify";
import {BaseApi, LoginRequest, LoginResponse, User} from "../apis/base/base";
import {TYPES} from "../types";
import {BaseBusinessLogic} from "./baseBusinessLogic";
import {RemoteApi} from "../apis/remote/remote";
import {provideSingleton} from "../util/decorators";
import {BadRequestError, UnauthorizedError} from "../apis/util/apiUtils";
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';

const jwtSecret = 'l1kj3jsad!#$%sakldjwlqekjsadflhvcxzowie3';

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

        const accessToken = this.generateJWTToken({ id: user.email });

        response.user = new User();
        response.user.email = user.email;
        response.user.displayName = user.name;
        response.user.role = user.role;
        response.user.photoUrl = user.photoUrl;
        response.accessToken = accessToken;

        response.loginSuccess = true;
        return response;
    }

    base64url(source: CryptoJS.lib.WordArray) {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    generateJWTToken(tokenPayload: { [key:string]: unknown } ) {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

        // Define token payload
        const payload: unknown = {
            iat,
            iss: 'Fuse',
            exp,
            ...tokenPayload
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this.base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this.base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature = `${encodedHeader}.${encodedPayload}`;
        // @ts-ignore
        signature = HmacSHA256(signature, jwtSecret);
        // @ts-ignore
        signature = this.base64url(signature);

        // Build and return the token
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
}
