import {BaseApi, LoginRequest, LoginResponse} from "src/apis/base/base";
import {BadRequestError, InternalServerError, ProtocolError, UnauthorizedError} from "../../apis/util/apiUtils";

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

      if(res.status === 200) {
        return res.json();
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
}

export const baseClient = new BaseClient();
