

export class ServiceRequest {
    public user?: User;
}

export class ServiceResponse {
    public loginSuccess?: boolean;
}

export class User {
    public _name?: string;
    public _password?: string;
}

export interface RemoteApi {
    service(serviceRequest: ServiceRequest): ServiceResponse;
}

