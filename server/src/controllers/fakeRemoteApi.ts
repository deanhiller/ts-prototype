import "reflect-metadata";
import {provide} from "inversify-binding-decorators";
import {RemoteApi, ServiceRequest, ServiceResponse} from "../apis/remote/remote";

@provide(FakeRemoteApi)
export class FakeRemoteApi implements RemoteApi {
    public constructor() {
    }

    service(serviceRequest: ServiceRequest): ServiceResponse {
        throw new Error("Method not implemented.");
    }

}
