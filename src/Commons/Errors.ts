import { ApplicationError } from "./ApplicationError";

export class NotImplementedError extends ApplicationError {
    public constructor() {
        super("NotImplemented");
    }
}

export class InvalidProgramStateError extends ApplicationError {
    public constructor(message?: string) {
        super(message != undefined ? `InvalidProgramState: ${message}` : "InvalidProgramState");
    }
}

export class NotSupportedError extends ApplicationError {
    public constructor() {
        super("NotSupported");
    }
}
