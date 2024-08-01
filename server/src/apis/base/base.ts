import Path from "../util/decorators"

export class LoginResponse {
    public loginSuccess?: boolean;
}

export class LoginRequest {
    public user?: User;
}

export class User {
    public name?: string;
    public password?: string;
}

export interface BaseApi {
    //@Path("/login")
    login(loginRequest: LoginRequest): Promise<LoginResponse>;

}

