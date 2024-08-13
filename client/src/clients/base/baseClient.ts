import {BaseApi, LoginRequest, LoginResponse, SignupRequest, SignupResponse} from "apis/base/base";
import {BadRequestError, InternalServerError, ProtocolError, UnauthorizedError} from "../../apis/util/apiUtils";
import {Injectable} from "@angular/core";
import {isDevMode} from '@angular/core';

let baseUrl = '';
if (isDevMode()) {
    console.log("Development mode");
    baseUrl = 'http://localhost:8080';
} else {
    console.log("Production mode");
}

async function fetchAndTranslate<R, T>(url: string, request: R):Promise<T> {
    const res = await fetch(url, {
        method: 'Post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if(res.status === 200) {
        return await res.json();
    }

    const json = await res.json();
    const error: ProtocolError = Object.assign(new ProtocolError(), json);
    switch (res.status) {
        case 401:
            throw new UnauthorizedError(error.message);
        case 408:
            throw new BadRequestError(error.message, error.field);
        case 500:
            throw new InternalServerError(error.message);
        default:
            throw new Error(`Missing defintion of code ${res.status} in BaseClient class(fix this first)`);
    }
}

@Injectable({providedIn: 'root'})
export class BaseClient implements BaseApi {

    async login(request: LoginRequest): Promise<LoginResponse> {
      const url = baseUrl+"/api/login";
      return await fetchAndTranslate(url, request);
    }

    async signup(request: SignupRequest): Promise<SignupResponse> {
        const url = baseUrl+"/api/signup";
        return await fetchAndTranslate(url, request);
    }


}

export const baseClient = new BaseClient();
