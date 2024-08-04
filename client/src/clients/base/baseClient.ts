import {BaseApi, LoginRequest, LoginResponse} from "src/apis/base/base";

const baseUrl = 'http://localhost:8080';

export class BaseClient implements BaseApi {
    async login(loginRequest: LoginRequest): Promise<LoginResponse> {
      const url = baseUrl+"/login";
      const res = await fetch(url, {
        method: 'Post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
      });

      return res.json()
    }
}

export const baseClient = new BaseClient();
