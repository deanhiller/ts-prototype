import { fetchMyContainer } from "./inversify.config";
import {injectable} from "inversify";
import {LoginRequest} from "./apis/base/base";
import {TYPES} from "./types";
import {RemoteApi, ServiceRequest, ServiceResponse} from "./apis/remote/remote";
import {BaseController} from "./controllers/baseController";

@injectable()
class MockRemoteApi implements RemoteApi {
    service(serviceRequest: ServiceRequest): ServiceResponse {
        throw new Error("Method not implemented.");
    }
}

const myContainer = fetchMyContainer(null);

myContainer.unbind(TYPES.RemoteApi);
myContainer.bind<RemoteApi>(TYPES.RemoteApi).to(MockRemoteApi);

const controller = myContainer.get<BaseController>(TYPES.BaseController);

let loginReq = new LoginRequest();
const result = controller.login(loginReq);

console.log("numbers2" + result);
