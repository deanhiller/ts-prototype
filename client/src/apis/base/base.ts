
export class LoginResponse {
    public loginSuccess?: boolean;
    public user?: User;
    public accessToken?: string;
}

export class LoginRequest {
    public name?: string;
    public password?: string;
}

export class User {
    public displayName?: string;
    public role?: string;
    public email?: string;
    public photoUrl?: string;
}

export interface BaseApi {
    //@Path("/login")
    login(loginRequest: LoginRequest): Promise<LoginResponse>;

}

