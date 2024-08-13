import {fluentProvide} from "inversify-binding-decorators";
import {Request, Response} from "express";
import {BadRequestError, HttpError, ProtocolError, UnauthorizedError} from "../apis/util/apiUtils";
import Logger from "bunyan";

export const provideSingleton = (identifier: any) => {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export type RequestHandler<T> = () => Promise<T>;

export function processError(log: Logger, res: Response, error: HttpError) {
    const theObj = new ProtocolError();
    theObj.name = error.name;

    if (error instanceof BadRequestError) {
        log.info("Bad Request:", error.message);
        // Handle bad request error
        theObj.message = error.message;
        theObj.field = error.field;
    } else if (error instanceof UnauthorizedError) {
        log.info("Unauthorized:", error.message);
        // Handle unauthorized error
        theObj.message = error.message;
    }

    const body = JSON.stringify(theObj);

    return res.status(error.code).send(body);
}

export async function translateOrReturn<T>(log: Logger, res:Response, handler: RequestHandler<T>): Promise<Response> {
    try {
        // You can add pre-processing logic here
        const result = await handler();
        const body = JSON.stringify(result);
        return res.status(200).send(body);
    } catch (error) {
        if(error instanceof HttpError) {
            return processError(log, res, error);
        } else if(error instanceof Error) {
            log.error("Error on server:" + error);
            log.error("Chokepoint. Stack:"+error.stack);
        } else {
            log.error("Something is throwing an error that is not a subclass of Error!!! ahhhh!!! msg="+error);
        }

        const theObj = new ProtocolError();
        theObj.message = "Internal Server Error";
        const body = JSON.stringify(theObj);
        // Handle any errors thrown by the handler
        res.status(500).send(body);
        return res;
    }
}
