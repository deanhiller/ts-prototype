
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

export class SignupRequest {
    public displayName?: string;
    public email?: string;
    public password?: string;
    public role?: string;

}

export class SignupResponse {
    public success?: boolean;
    public errorMessage?: string;
    public accessToken?: string;
}

export interface BaseApi {
    //@Path("/login")
    login(loginRequest: LoginRequest): Promise<LoginResponse>;

    signup(request: SignupRequest): Promise<SignupResponse>;

}

