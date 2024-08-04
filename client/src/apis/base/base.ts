
export class LoginResponse {
    public loginSuccess?: boolean;
    public user?: User;
}

export class LoginRequest {
    //refactor to remove user and only pass in email/password!!!
    //return user in LoginResponse which may have a lot of good info
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

