
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
    login(loginRequest: LoginRequest): LoginResponse;
}

