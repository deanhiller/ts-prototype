import "reflect-metadata";
import 'source-map-support/register';
import {inject, injectable} from "inversify";
import {BaseApi, LoginRequest, LoginResponse, SignupRequest, SignupResponse, User} from "../apis/base/base";
import {BaseBusinessLogic} from "./baseBusinessLogic";
import {RemoteApi} from "../apis/remote/remote";
import {provideSingleton} from "../util/decorators";
import {BadRequestError, UnauthorizedError} from "../apis/util/apiUtils";
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import {TYPES} from "../types";
import {PrismaClient, RoleDbo, UserDbo} from "@prisma/client";
import {UserWithPosts} from "../db/model";
import * as CryptoJS from 'crypto-js';

const jwtSecret = 'l1kj3jsad!#$%sakldjwlqekjsadflhvcxzowie3';

function throwError<T>(msg: string, field: string): string {
    throw new BadRequestError(msg, field);
}

@provideSingleton(BaseController)
export class BaseController implements BaseApi {
    private _baseBizLogic: BaseBusinessLogic;
    private _prisma: PrismaClient;

    public constructor(
        @inject(TYPES.PrismaClient) prisma: PrismaClient,
        baseBizLogic: BaseBusinessLogic,
        @inject(TYPES.RemoteApi) remoteApi: RemoteApi
    ) {
        this._prisma = prisma;
        this._baseBizLogic = baseBizLogic;
    }

    async login(loginRequest: LoginRequest): Promise<LoginResponse> {

        const email = loginRequest.name ?? throwError<string>("email is required", "email");
        const password = loginRequest.password ?? throwError<string>("password is required", "password");

        const userDbo: UserWithPosts | null = await this._prisma.userDbo.findUnique({
            where: {
                email: email
            },
            include: {
                user_roles: {
                    include: {
                        user: true
                    },
                },
            },
        });

        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        const response = new LoginResponse();
        if(!userDbo || userDbo.hashedPassword != hashedPassword) {
            throw new UnauthorizedError("User/password is not found");
        }

        const accessToken = this.generateJWTToken({ id: email });

        const userRoles = userDbo.user_roles;
        if(userRoles.length != 1)
            throw new Error("User has wrong length of user roles="+userRoles.length);

        const role1: RoleDbo = userRoles[0];

        response.user = new User();
        response.user.email = userDbo.email;
        response.user.displayName = userDbo.name !== null ? userDbo.name : undefined;
        response.user.role = role1.name;
        response.user.photoUrl = userDbo.photoUrl !== null ? userDbo.photoUrl : undefined;
        response.accessToken = accessToken;

        response.loginSuccess = true;
        return response;
    }

    async signup(request: SignupRequest): Promise<SignupResponse> {
        const name = request.displayName ?? throwError<string>("name is required", "name");
        const email = request.email ?? throwError<string>("email is required", "email");
        const role = request.role ?? throwError<string>("role is required", "role");

        const userDbo: UserDbo | null = await this._prisma.userDbo.findUnique({
            where: {
                email: request.email
            }
        });

        const pw = request.password ?? throwError<string>("password is required", "password");
        if(userDbo !== null) {
            const resp = new SignupResponse();
            resp.success = false;
            resp.errorMessage = "User already exists";
            return resp;
        } else if(pw.length < 10) {
            const resp = new SignupResponse();
            resp.success = false;
            resp.errorMessage = "Password must be at least 10 characters";
            return resp;
        }

        const hashedPassword = CryptoJS.SHA256(pw).toString(CryptoJS.enc.Hex);

        await this._prisma.userDbo.create({
            data: {
                email: email,
                name: name,
                hashedPassword: hashedPassword,
                user_roles: {
                    create: [
                        {
                            name: role
                        }
                    ]
                }
            }
        });

        const accessToken = this.generateJWTToken({ id: email });

        const resp = new SignupResponse();
        resp.success = true;
        resp.accessToken = accessToken;
        return resp;
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
