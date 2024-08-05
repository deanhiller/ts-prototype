

export class ServiceRequest {
    public something?: Something;
}

export class ServiceResponse {
    public loginSuccess?: boolean;
}

export class Something {
    public _field?: string;
    public _something2?: string;
}

export interface RemoteApi {
    service(serviceRequest: ServiceRequest): ServiceResponse;
}

