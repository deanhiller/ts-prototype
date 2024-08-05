
export class ProtocolError {
    public message?: string;
    public field?: string;
    public name?: string;
}

export class HttpError extends Error {
    public code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

export class BadRequestError extends HttpError {
    public field: string;

    constructor(message: string, field: string) {
        super(message, 400); // Call the parent class constructor with the message
        this.name = 'BadRequest'; // Set the error name
        this.field = field; // Additional field
        Object.setPrototypeOf(this, new.target.prototype); // Correct the prototype chain
    }
}

export class UnauthorizedError extends HttpError {

    constructor(message: string) {
        super(message, 401); // Call the parent class constructor with the message
        this.name = 'Unauthorized'; // Set the error name
        Object.setPrototypeOf(this, new.target.prototype); // Correct the prototype chain
    }
}

export class InternalServerError extends HttpError {

    constructor(message: string) {
        super(message, 500); // Call the parent class constructor with the message
        this.name = 'InternalServerError'; // Set the error name
        Object.setPrototypeOf(this, new.target.prototype); // Correct the prototype chain
    }
}
