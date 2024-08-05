import {fluentProvide} from "inversify-binding-decorators";
import {Request, Response} from "express";
import {BadRequestError, HttpError, ProtocolError, UnauthorizedError} from "../apis/util/apiUtils";

export const provideSingleton = (identifier: any) => {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export type RequestHandler = () => Promise<Response>;

export function processError(res: Response, error: HttpError) {
    const theObj = new ProtocolError();
    theObj.name = error.name;

    if (error instanceof BadRequestError) {
        console.error("Bad Request:", error.message);
        // Handle bad request error
        theObj.message = error.message;
        theObj.field = error.field;
    } else if (error instanceof UnauthorizedError) {
        console.error("Unauthorized:", error.message);
        // Handle unauthorized error
        theObj.message = error.message;
    }

    const body = JSON.stringify(theObj);

    return res.status(error.code).send(body);
}

export async function translateOrReturn(res:Response, handler: RequestHandler): Promise<Response> {
    try {
        // You can add pre-processing logic here
        const result = await handler();
        return result;
    } catch (error) {
        if(error instanceof HttpError) {
            return processError(res, error);
        } else {
            console.error("Error on server:" + error);
            const theObj = new ProtocolError();
            theObj.message = "Internal Server Error";
            const body = JSON.stringify(theObj);
            // Handle any errors thrown by the handler
            res.status(500).send(body);
            return res;
        }
    }
}
