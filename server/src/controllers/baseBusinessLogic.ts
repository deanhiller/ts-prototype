import "reflect-metadata";
import {provide} from "inversify-binding-decorators";

@provide(BaseBusinessLogic)
class BaseBusinessLogic {
    public constructor(
    ) {
    }

    public sneak() { return "deano" }

}

export { BaseBusinessLogic };
