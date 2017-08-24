// @flow
import { ApplicationError } from "./ApplicationError";

export class NotImplementedError extends ApplicationError {
    constructor() {
        super("NotImplemneted");
    }
}

export class InvalidProgramStateError extends ApplicationError {
    constructor() {
        super("InvalidProgramState");
    }
}

export class NotSuppoertedError extends ApplicationError {
    constructor() {
        super("NotSuppoerted");
    }
}
