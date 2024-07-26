// file inversify.inversify.config.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import {BaseController} from "./controllers/baseController";
import {FakeRemoteApi} from "./controllers/fakeRemoteApi";
import {RemoteApi} from "./apis/remote/remote";

const myContainer = new Container();
myContainer.load(buildProviderModule());

myContainer.bind<BaseController>(TYPES.BaseController).to(BaseController);
myContainer.bind<RemoteApi>(TYPES.RemoteApi).to(FakeRemoteApi);

export { myContainer };
