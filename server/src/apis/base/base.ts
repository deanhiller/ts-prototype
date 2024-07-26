
export class LoginResponse {
    public loginSuccess?: boolean;
}

export class LoginRequest {
    public user?: User;
}

export class User {
    public _name?: string;
    public _password?: string;
}

export interface BaseApi {
    login(loginRequest: LoginRequest): LoginResponse;
}

