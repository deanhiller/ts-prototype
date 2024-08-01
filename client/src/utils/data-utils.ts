import {BaseApi, LoginRequest, LoginResponse} from "../apis/base/base";

const baseUrl = 'http://localhost:8080';

export const getData = async <T>(
    url: string,
    loginReq: LoginRequest
)
    : Promise<T> => {
  const res = await fetch(url, {
    method: 'Post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(loginReq)
  });

  return await res.json();
}

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
